import { User, Briefcase, GraduationCap, Code, Mail } from 'lucide-react';
import ProfileContent from '../content/ProfileContent';
import ExperienceContent from '../content/ExperienceContent';
import EducationContent from '../content/EducationContent';

export const menuItems = [
  { 
    icon: User, 
    label: 'Profile',
    bgGradient: 'from-purple-900 via-indigo-900 to-blue-900',
    content: ProfileContent
  },
  { 
    icon: Briefcase, 
    label: 'Experience',
    bgGradient: 'from-pink-900 via-rose-900 to-red-900',
    content: ExperienceContent
  },
  { 
    icon: GraduationCap, 
    label: 'Education',
    bgGradient: 'from-orange-900 via-amber-900 to-yellow-900',
    content: EducationContent
  },
  /*
  { 
    icon: Code, 
    label: 'Skills',
    bgGradient: 'from-emerald-900 via-teal-900 to-cyan-900',
    content: SkillsContent
  },
  { 
    icon: Mail, 
    label: 'Contact',
    bgGradient: 'from-slate-900 via-gray-900 to-zinc-900',
    content: ContactContent
  }*/
];