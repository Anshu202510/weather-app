from typing import Dict, List, Tuple
import re

class ATSAnalyzer:
    """Analyze resume ATS compatibility and scoring"""
    
    # Importance weights for different factors
    WEIGHTS = {
        'contact_info': 5,
        'professional_summary': 5,
        'skills': 20,
        'experience': 25,
        'education': 15,
        'certifications': 10,
        'keywords': 15,
        'formatting': 5,
        'completeness': 5,
    }
    
    # Common ATS keywords by category
    KEYWORD_CATEGORIES = {
        'technical_skills': [
            'python', 'java', 'javascript', 'react', 'angular', 'vue',
            'node.js', 'express', 'django', 'flask', 'sql', 'mongodb',
            'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'git',
            'agile', 'scrum', 'jira', 'rest api', 'graphql'
        ],
        'soft_skills': [
            'leadership', 'communication', 'teamwork', 'problem solving',
            'project management', 'analytical thinking', 'collaboration',
            'time management', 'adaptability', 'creativity'
        ],
        'certifications': [
            'aws certified', 'kubernetes certified', 'scrum master',
            'project management professional', 'certified ethical hacker'
        ],
        'experience_keywords': [
            'managed', 'developed', 'designed', 'implemented', 'led',
            'increased', 'improved', 'reduced', 'optimized', 'achieved'
        ]
    }
    
    def __init__(self, parsed_resume: Dict):
        self.resume_data = parsed_resume
        self.scores = {}
        
    def analyze(self) -> Dict:
        """Perform comprehensive ATS analysis"""
        self.scores = {
            'contact_info_score': self._score_contact_info(),
            'summary_score': self._score_summary(),
            'skills_score': self._score_skills(),
            'experience_score': self._score_experience(),
            'education_score': self._score_education(),
            'certifications_score': self._score_certifications(),
            'keywords_score': self._score_keywords(),
            'formatting_score': self._score_formatting(),
            'completeness_score': self._score_completeness(),
        }
        
        overall_score = self._calculate_overall_score()
        
        return {
            'overall_score': overall_score,
            'detailed_scores': self.scores,
            'issues': self._identify_issues(),
            'recommendations': self._get_recommendations(),
            'keyword_matches': self._analyze_keyword_matches(),
        }
    
    def _score_contact_info(self) -> float:
        """Score contact information completeness"""
        contact = self.resume_data.get('contact_info', {})
        score = 0
        
        if contact.get('email'):
            score += 40
        if contact.get('phone'):
            score += 30
        if contact.get('linkedin'):
            score += 15
        if contact.get('github'):
            score += 15
        
        return min(score, 100)
    
    def _score_summary(self) -> float:
        """Score professional summary"""
        summary = self.resume_data.get('professional_summary', '')
        
        if not summary:
            return 0
        
        score = 0
        word_count = len(summary.split())
        
        # Check word count (ideal: 50-150 words)
        if 50 <= word_count <= 150:
            score += 40
        elif word_count > 20:
            score += 20
        
        # Check for action words
        action_words = ['driven', 'experienced', 'skilled', 'passionate', 'dedicated']
        if any(word in summary.lower() for word in action_words):
            score += 30
        
        # Check for keywords
        if any(skill in summary.lower() for skill in self.KEYWORD_CATEGORIES['technical_skills']):
            score += 30
        
        return min(score, 100)
    
    def _score_skills(self) -> float:
        """Score skills section"""
        skills = self.resume_data.get('skills', [])
        
        if not skills:
            return 0
        
        score = 0
        
        # Check number of skills (ideal: 10-20)
        if 10 <= len(skills) <= 20:
            score += 50
        elif len(skills) >= 5:
            score += 30
        
        # Check for mix of technical and soft skills
        technical_count = sum(1 for skill in skills if any(tech in skill.lower() for tech in self.KEYWORD_CATEGORIES['technical_skills']))
        soft_count = sum(1 for skill in skills if any(soft in skill.lower() for soft in self.KEYWORD_CATEGORIES['soft_skills']))
        
        if technical_count > 0 and soft_count > 0:
            score += 50
        elif technical_count > 0 or soft_count > 0:
            score += 25
        
        return min(score, 100)
    
    def _score_experience(self) -> float:
        """Score experience section"""
        experience = self.resume_data.get('experience', [])
        
        if not experience:
            return 0
        
        score = 0
        
        # Check number of positions
        if len(experience) >= 3:
            score += 40
        elif len(experience) >= 2:
            score += 25
        else:
            score += 10
        
        # Check for action words
        action_words = self.KEYWORD_CATEGORIES['experience_keywords']
        has_action_words = any(any(word in str(exp).lower() for word in action_words) for exp in experience)
        if has_action_words:
            score += 30
        
        # Check for years/dates
        has_dates = any(exp.get('year') for exp in experience)
        if has_dates:
            score += 30
        
        return min(score, 100)
    
    def _score_education(self) -> float:
        """Score education section"""
        education = self.resume_data.get('education', [])
        
        if not education:
            return 30  # No education listed
        
        score = 0
        
        if len(education) > 0:
            score += 50
        
        # Check for advanced degrees
        has_advanced = any('master' in edu.get('degree', '').lower() or 'phd' in edu.get('degree', '').lower() for edu in education)
        if has_advanced:
            score += 30
        
        # Check for institution names
        has_institutions = any(edu.get('institution') for edu in education)
        if has_institutions:
            score += 20
        
        return min(score, 100)
    
    def _score_certifications(self) -> float:
        """Score certifications"""
        certs = self.resume_data.get('certifications', [])
        
        if not certs:
            return 0
        
        score = 50
        
        # Each relevant certification adds points
        relevant_certs = sum(1 for cert in certs if any(keyword in cert.lower() for keyword in self.KEYWORD_CATEGORIES['certifications']))
        score += min(relevant_certs * 10, 50)
        
        return min(score, 100)
    
    def _score_keywords(self) -> float:
        """Score keyword presence"""
        resume_text = ' '.join(str(v) for v in self.resume_data.values()).lower()
        score = 0
        
        # Count keyword matches
        total_keywords = sum(len(keywords) for keywords in self.KEYWORD_CATEGORIES.values())
        matched_keywords = sum(keywords.count(keyword) for keywords in self.KEYWORD_CATEGORIES.values() for keyword in keywords if keyword in resume_text)
        
        if total_keywords > 0:
            percentage = (matched_keywords / total_keywords) * 100
            score = min(percentage, 100)
        
        return score
    
    def _score_formatting(self) -> float:
        """Score formatting quality"""
        # This would require the original text to check formatting
        # For now, return a default score
        return 70  # Default formatting score
    
    def _score_completeness(self) -> float:
        """Score overall resume completeness"""
        required_sections = ['contact_info', 'experience', 'education']
        present_sections = sum(1 for section in required_sections if self.resume_data.get(section))
        
        return (present_sections / len(required_sections)) * 100
    
    def _calculate_overall_score(self) -> int:
        """Calculate weighted overall ATS score"""
        total_weight = sum(self.WEIGHTS.values())
        weighted_sum = 0
        
        score_keys = {
            'contact_info_score': 'contact_info',
            'summary_score': 'professional_summary',
            'skills_score': 'skills',
            'experience_score': 'experience',
            'education_score': 'education',
            'certifications_score': 'certifications',
            'keywords_score': 'keywords',
            'formatting_score': 'formatting',
            'completeness_score': 'completeness',
        }
        
        for score_key, weight_key in score_keys.items():
            if score_key in self.scores:
                weighted_sum += self.scores[score_key] * self.WEIGHTS.get(weight_key, 0)
        
        overall = int(weighted_sum / total_weight) if total_weight > 0 else 0
        return min(max(overall, 0), 100)
    
    def _identify_issues(self) -> List[str]:
        """Identify issues in the resume"""
        issues = []
        
        if not self.resume_data.get('contact_info', {}):
            issues.append('Missing contact information')
        
        if not self.resume_data.get('professional_summary'):
            issues.append('Missing professional summary or objective')
        
        if not self.resume_data.get('skills'):
            issues.append('Skills section is empty or missing')
        
        if not self.resume_data.get('experience'):
            issues.append('No work experience listed')
        
        if self.scores.get('keywords_score', 0) < 40:
            issues.append('Low keyword match - consider adding industry-specific terms')
        
        return issues
    
    def _get_recommendations(self) -> List[str]:
        """Get ATS optimization recommendations"""
        recommendations = []
        
        if self.scores.get('summary_score', 0) < 50:
            recommendations.append('Enhance professional summary with relevant keywords')
        
        if self.scores.get('skills_score', 0) < 70:
            recommendations.append('Add more technical and soft skills')
        
        if self.scores.get('experience_score', 0) < 60:
            recommendations.append('Use action words and quantifiable achievements in experience')
        
        if self.scores.get('keywords_score', 0) < 50:
            recommendations.append('Incorporate industry-specific keywords throughout')
        
        recommendations.append('Use standard section headers (Experience, Education, Skills, etc.)')
        recommendations.append('Avoid graphics, images, and unusual formatting')
        recommendations.append('Use standard fonts (Arial, Calibri, Times New Roman)')
        
        return recommendations
    
    def _analyze_keyword_matches(self) -> Dict:
        """Analyze which keywords are matched"""
        resume_text = ' '.join(str(v) for v in self.resume_data.values()).lower()
        
        matches = {
            'technical_skills': [kw for kw in self.KEYWORD_CATEGORIES['technical_skills'] if kw in resume_text],
            'soft_skills': [kw for kw in self.KEYWORD_CATEGORIES['soft_skills'] if kw in resume_text],
            'certifications': [kw for kw in self.KEYWORD_CATEGORIES['certifications'] if kw in resume_text],
            'experience_keywords': [kw for kw in self.KEYWORD_CATEGORIES['experience_keywords'] if kw in resume_text],
        }
        
        return matches
