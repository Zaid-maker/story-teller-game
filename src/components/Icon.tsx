import * as Lucide from 'lucide-react';

// Default icon if the requested one isn't found
const DefaultIcon = Lucide.Box; 

export const Icon = ({ name, ...props }: { name: string | null } & Lucide.LucideProps) => {
    const LucideIcon = name ? (Lucide as any)[name] : DefaultIcon;
    
    if (!LucideIcon || typeof LucideIcon !== 'object') {
        return <DefaultIcon {...props} />;
    }
    
    return <LucideIcon {...props} />;
};