import re
import PyPDF2
from typing import Dict, List, Tuple

class ResumeParser:
    """Parse and extract information from resume text or PDF"""
    
    def __init__(self, resume_text: str):
        self.resume_text = resume_text.lower()
        self.sections = {}
        self.structured_data = {}
        
    @staticmethod
    def extract_from_pdf(pdf_path: str) -> str:
        """Extract text from PDF file"""
        text = ""
        try:
            with open(pdf_path, 'rb') as file:
                pdf_reader = PyPDF2.PdfReader(file)
                for page in pdf_reader.pages:
                    text += page.extract_text()
        except Exception as e:
            print(f"Error reading PDF: {e}")
        return text
    
    def parse(self) -> Dict:
        """Parse resume and extract all information"""
        self.structured_data = {
            'contact_info': self._extract_contact_info(),
            'professional_summary': self._extract_section('professional summary|summary|objective'),
            'experience': self._extract_experience(),
            'education': self._extract_education(),
            'skills': self._extract_skills(),
            'certifications': self._extract_certifications(),
            'projects': self._extract_projects(),
            'languages': self._extract_languages(),
        }
        return self.structured_data
    
    def _extract_contact_info(self) -> Dict:
        """Extract contact information"""
        contact = {}
        
        # Email
        email_pattern = r'[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}'
        email_match = re.search(email_pattern, self.resume_text)
        if email_match:
            contact['email'] = email_match.group()
        
        # Phone
        phone_pattern = r'\b(?:\+?1[-.]?)?\(?([0-9]{3})\)?[-.]?([0-9]{3})[-.]?([0-9]{4})\b'
        phone_match = re.search(phone_pattern, self.resume_text)
        if phone_match:
            contact['phone'] = phone_match.group()
        
        # LinkedIn
        linkedin_pattern = r'linkedin\.com/in/[^\s]+'
        linkedin_match = re.search(linkedin_pattern, self.resume_text)
        if linkedin_match:
            contact['linkedin'] = linkedin_match.group()
        
        # GitHub
        github_pattern = r'github\.com/[^\s]+'
        github_match = re.search(github_pattern, self.resume_text)
        if github_match:
            contact['github'] = github_match.group()
        
        return contact
    
    def _extract_section(self, section_name: str) -> str:
        """Extract a specific section from resume"""
        pattern = f'{section_name}[^a-z]*([^a-z][^a-z0-9]*?)(?=^[a-z]+|\Z)'
        match = re.search(pattern, self.resume_text, re.MULTILINE | re.IGNORECASE)
        return match.group(1).strip() if match else ""
    
    def _extract_experience(self) -> List[Dict]:
        """Extract work experience"""
        experience = []
        # Extract job positions with years
        job_pattern = r'([a-z\s]+)\s+(?:at|@)\s+([a-z\s]+)\s*\|?\s*([0-9]{4})?'
        matches = re.finditer(job_pattern, self.resume_text, re.IGNORECASE)
        
        for match in matches:
            experience.append({
                'title': match.group(1).strip(),
                'company': match.group(2).strip(),
                'year': match.group(3) if match.group(3) else None
            })
        
        return experience
    
    def _extract_education(self) -> List[Dict]:
        """Extract education information"""
        education = []
        # Extract degrees and universities
        degree_pattern = r'(bachelor|master|phd|b\.s\.|m\.s\.|b\.a\.|m\.a\.|b\.tech|m\.tech)[^a-z]*([a-z\s&]+?)(?:from|@|university|college)\s+([a-z\s]+?)(?:\||,|\d{4}|$)'
        matches = re.finditer(degree_pattern, self.resume_text, re.IGNORECASE)
        
        for match in matches:
            education.append({
                'degree': match.group(1).strip(),
                'field': match.group(2).strip() if len(match.groups()) > 1 else '',
                'institution': match.group(3).strip() if len(match.groups()) > 2 else ''
            })
        
        return education
    
    def _extract_skills(self) -> List[str]:
        """Extract skills"""
        skills_section = self._extract_section('skills')
        if not skills_section:
            return []
        
        # Split by common delimiters
        skills = re.split(r'[,•\-\n]', skills_section)
        return [skill.strip() for skill in skills if skill.strip()]
    
    def _extract_certifications(self) -> List[str]:
        """Extract certifications"""
        cert_section = self._extract_section('certifications?|licenses?')
        if not cert_section:
            return []
        
        certs = re.split(r'[,•\-\n]', cert_section)
        return [cert.strip() for cert in certs if cert.strip()]
    
    def _extract_projects(self) -> List[Dict]:
        """Extract projects"""
        projects = []
        projects_section = self._extract_section('projects?')
        
        if projects_section:
            # Split by common separators
            project_items = re.split(r'\n(?=[A-Z])', projects_section)
            for item in project_items:
                if item.strip():
                    projects.append({'description': item.strip()})
        
        return projects
    
    def _extract_languages(self) -> List[str]:
        """Extract languages"""
        lang_section = self._extract_section('languages?')
        if not lang_section:
            return []
        
        languages = re.split(r'[,•\-\n]', lang_section)
        return [lang.strip() for lang in languages if lang.strip()]
