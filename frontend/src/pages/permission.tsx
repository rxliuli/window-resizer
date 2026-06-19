import { Button } from '@/components/ui/button'
import { native } from '@/lib/native'
import { Loader2, Settings } from 'lucide-react'
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
    <div className="p-6 space-y-4">
      <div>
        <h2 className="text-lg font-semibold">Accessibility Permission Required</h2>
        <p className="text-sm text-muted-foreground">
          To adjust window sizes, we need access to your system's accessibility features
        </p>
      </div>

      <ol className="list-decimal list-inside space-y-2 text-sm">
        <li>Open System Settings</li>
        <li>Navigate to Privacy & Security &gt; Accessibility</li>
        <li>Toggle the switch to grant WindowResizer accessibility permission</li>
      </ol>

      <Button
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
    </div>
  )
}
