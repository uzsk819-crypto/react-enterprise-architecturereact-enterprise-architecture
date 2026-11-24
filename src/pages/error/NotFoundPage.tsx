import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Home, ArrowLeft, FileQuestion } from 'lucide-react';
import { Button } from '../../components/ui/Button';
import { ROUTE_PATHS } from '../../routes/routePaths';

export const NotFoundPage: React.FC = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex items-center justify-center bg-background p-6">
      <div className="max-w-md w-full text-center flex flex-col items-center">
        <div className="h-16 w-16 rounded-2xl bg-surface border border-border flex items-center justify-center text-primary shadow-lg mb-6">
          <FileQuestion className="h-8 w-8" />
        </div>
        <span className="text-sm font-bold uppercase tracking-widest text-primary mb-2">
          Error 404
        </span>
        <h1 className="text-3xl font-extrabold text-text-primary tracking-tight mb-2">
          Page Not Found
        </h1>
        <p className="text-sm text-text-muted mb-8 leading-relaxed">
          The requested resource does not exist or has been relocated to another route.
        </p>

        <div className="flex items-center gap-3">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate(-1)}
            leftIcon={<ArrowLeft className="h-4 w-4" />}
          >
            Go Back
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={() => navigate(ROUTE_PATHS.DASHBOARD)}
            leftIcon={<Home className="h-4 w-4" />}
          >
            Return to Dashboard
          </Button>
        </div>
      </div>
    </div>
  );
};
export default NotFoundPage;
