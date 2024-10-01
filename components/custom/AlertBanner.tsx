import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Rocket, TriangleAlert } from 'lucide-react';

type AlertBannerProps = {
  isCompleted: boolean;
  missingFieldsCount: number;
  requiredFieldsCount: number;
};

const AlertBanner = ({
  isCompleted,
  missingFieldsCount,
  requiredFieldsCount,
}: AlertBannerProps) => {
  return (
    <Alert
      className="my-4"
      variant={`${isCompleted ? 'complete' : 'destructive'}`}
    >
      {isCompleted ? (
        <Rocket className="h-4 w-4" />
      ) : (
        <TriangleAlert className="h-4 w-4" />
      )}
      <AlertTitle className="text-xs font-medium">
        {missingFieldsCount} missing field(s) / {requiredFieldsCount} required
        field(s)
      </AlertTitle>
      <AlertDescription className="text-xs">
        {isCompleted
          ? 'Great Job!, you can now publish'
          : 'You can only publish when all required fields are completed'}
      </AlertDescription>
    </Alert>
  );
};
export default AlertBanner;
