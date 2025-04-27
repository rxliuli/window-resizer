import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'

export function AboutPage() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>About Window Resizer</CardTitle>
        <CardDescription>
          A simple tool to help you resize windows to preset dimensions
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <p>
          Window Resizer is a desktop utility that helps you quickly resize windows
          to predefined dimensions. Perfect for developers, designers, and anyone
          who needs precise window sizes.
        </p>
        <div>
          <h3 className="font-medium mb-2">Features:</h3>
          <ul className="list-disc pl-6 space-y-1">
            <li>Preset window dimensions</li>
            <li>Quick resizing with customizable presets</li>
            <li>Simple and intuitive interface</li>
            <li>Keyboard shortcuts support (coming soon)</li>
          </ul>
        </div>
        <p className="text-sm text-muted-foreground">
          Version 1.0.0 • Made with ❤️ using Tauri and React
        </p>
      </CardContent>
    </Card>
  )
}
