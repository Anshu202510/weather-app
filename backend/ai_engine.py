import openai
import os
from typing import Dict, List
from dotenv import load_dotenv

load_dotenv()

class AIEngine:
    """AI-powered analysis using OpenAI GPT"""
    
    def __init__(self):
        self.api_key = os.getenv('OPENAI_API_KEY')
        if not self.api_key:
            raise ValueError('OPENAI_API_KEY environment variable not set')
        openai.api_key = self.api_key
        self.model = 'gpt-3.5-turbo'
    
    def generate_summary(self, resume_data: Dict) -> str:
        """Generate a professional summary of the candidate"""
        prompt = f"""
        Based on this resume data, provide a brief professional summary (2-3 sentences) of the candidate:
        
        Experience: {resume_data.get('experience', [])}
        Education: {resume_data.get('education', [])}
        Skills: {resume_data.get('skills', [])}
        
        Summary:
        """
        
        return self._call_gpt(prompt)
    
    def generate_interview_questions(self, resume_data: Dict, target_role: str = None) -> List[str]:
        """Generate 10 interview questions based on resume"""
        role_context = f"for the {target_role} position" if target_role else ""
        
        prompt = f"""
        Generate 10 interview questions {role_context} based on this resume:
        
        Skills: {resume_data.get('skills', [])}
        Experience: {resume_data.get('experience', [])}
        Education: {resume_data.get('education', [])}
        
        Format as numbered list.
        """
        
        response = self._call_gpt(prompt)
        questions = [q.strip() for q in response.split('\n') if q.strip() and q[0].isdigit()]
        return questions[:10]
    
    def generate_career_roadmap(self, resume_data: Dict, target_role: str) -> Dict:
        """Generate a 6-month personalized career roadmap"""
        prompt = f"""
        Create a detailed 6-month career development roadmap for someone with this profile:
        
        Current Skills: {resume_data.get('skills', [])}
        Experience: {resume_data.get('experience', [])}
        Education: {resume_data.get('education', [])}
        Target Role: {target_role}
        
        Include:
        1. Month-by-month learning goals
        2. Skills to develop
        3. Certifications to pursue
        4. Portfolio projects
        5. Timeline and milestones
        
        Format as structured JSON.
        """
        
        response = self._call_gpt(prompt)
        return self._parse_roadmap_response(response)
    
    def suggest_job_roles(self, resume_data: Dict) -> List[Dict]:
        """Suggest suitable job roles based on skills and experience"""
        prompt = f"""
        Based on these skills and experience, suggest 5 most suitable job roles:
        
        Skills: {resume_data.get('skills', [])}
        Experience: {resume_data.get('experience', [])}
        Education: {resume_data.get('education', [])}
        
        For each role, provide:
        1. Job title
        2. Why it's a good fit
        3. Salary range (estimate)
        4. Growth potential
        
        Format as numbered list.
        """
        
        response = self._call_gpt(prompt)
        return self._parse_job_roles(response)
    
    def analyze_skill_gaps(self, resume_data: Dict, target_role: str) -> Dict:
        """Analyze skill gaps for target role"""
        prompt = f"""
        Analyze the skill gaps for someone with this profile targeting a {target_role} position:
        
        Current Skills: {resume_data.get('skills', [])}
        Experience Level: {len(resume_data.get('experience', []))} positions
        Education: {resume_data.get('education', [])}
        
        Provide:
        1. Skills they have
        2. Missing skills
        3. Nice-to-have skills
        4. Learning priority
        5. Time to acquire each skill
        
        Format as structured analysis.
        """
        
        response = self._call_gpt(prompt)
        return self._parse_skill_analysis(response)
    
    def generate_resume_improvements(self, resume_data: Dict) -> List[str]:
        """Generate specific resume improvement suggestions"""
        prompt = f"""
        Provide 10 specific, actionable suggestions to improve this resume:
        
        Current Content:
        {resume_data}
        
        Focus on:
        1. ATS optimization
        2. Impact and achievement focus
        3. Keyword optimization
        4. Clarity and professionalism
        5. Formatting best practices
        
        Format as numbered list.
        """
        
        response = self._call_gpt(prompt)
        improvements = [imp.strip() for imp in response.split('\n') if imp.strip() and imp[0].isdigit()]
        return improvements[:10]
    
    def _call_gpt(self, prompt: str) -> str:
        """Call OpenAI GPT API"""
        try:
            response = openai.ChatCompletion.create(
                model=self.model,
                messages=[
                    {"role": "system", "content": "You are an expert AI resume analyzer and career coach."},
                    {"role": "user", "content": prompt}
                ],
                temperature=0.7,
                max_tokens=1000
            )
            return response['choices'][0]['message']['content']
        except Exception as e:
            print(f"Error calling GPT API: {e}")
            return f"Error: {str(e)}"
    
    def _parse_roadmap_response(self, response: str) -> Dict:
        """Parse roadmap response from GPT"""
        # This would parse the GPT response into structured format
        return {
            'roadmap': response,
            'months': [
                {'month': i, 'goals': f'Month {i} goals'} 
                for i in range(1, 7)
            ]
        }
    
    def _parse_job_roles(self, response: str) -> List[Dict]:
        """Parse job roles response from GPT"""
        # This would parse and structure the job roles
        return [{
            'title': 'Job Role',
            'fit_score': 85,
            'description': response
        }]
    
    def _parse_skill_analysis(self, response: str) -> Dict:
        """Parse skill gap analysis response"""
        return {
            'analysis': response,
            'current_skills': [],
            'missing_skills': [],
            'nice_to_have': []
        }
