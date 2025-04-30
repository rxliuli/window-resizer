import { Button } from '@/components/ui/button'
import { native } from '@/lib/native'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { InfoIcon, Loader2, Settings } from 'lucide-react'
import { useMutation } from '@tanstack/react-query'
import { toast } from 'sonner'

export function PermissionPage() {
  const requestMutation = useMutation({
    mutationFn: async () => {
      await native().permission.request()
      await new Promise<void>((resolve) =>
        setInterval(async () => {
          const result = await native().permission.check()
          if (result) {
            resolve()
          }
        }, 500),
      )
      toast.success('Accessibility permission granted')
      await new Promise((resolve) => setTimeout(resolve, 1000))
      await native().window.close()
    },
  })
  return (
    <div className="container max-w-2xl mx-auto py-12 px-4">
      <Card>
        <CardHeader>
          <CardTitle>Accessibility Permission Required</CardTitle>
          <CardDescription>
            To adjust window sizes, we need access to your system's
            accessibility features
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <Alert variant="default" className="bg-muted">
            <InfoIcon className="h-4 w-4" />
            <AlertDescription>
              Please follow these steps to grant the required permissions:
            </AlertDescription>
          </Alert>

          <div className="space-y-4">
            <div className="relative pl-8 py-3 bg-muted/50 rounded-lg">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                1
              </div>
              <p>Open System Settings</p>
            </div>
            <div className="relative pl-8 py-3 bg-muted/50 rounded-lg">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                2
              </div>
              <p>Navigate to {'Privacy & Security > Accessibility'} </p>
            </div>
            <div className="relative pl-8 py-3 bg-muted/50 rounded-lg">
              <div className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 flex items-center justify-center rounded-full bg-primary text-primary-foreground text-xs font-medium">
                3
              </div>
              <p>
                Toggle the switch to grant WindowResizer accessibility
                permission.
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="w-full"
            onClick={() => requestMutation.mutate()}
            disabled={requestMutation.isPending}
          >
            {requestMutation.isPending ? (
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            ) : (
              <Settings className="mr-2 h-4 w-4" />
            )}
            Open System Settings
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}
