import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Plus, Pencil, Trash2 } from 'lucide-react'
import { ulid } from 'ulid'
import { native } from '@/lib/native'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'

interface PresetSize {
  id: string
  width: number
  height: number
}

export function HomePage() {
  const queryClient = useQueryClient()
  const [editingPreset, setEditingPreset] = useState<PresetSize | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newWidth, setNewWidth] = useState('')
  const [newHeight, setNewHeight] = useState('')

  const { data: presets = [] } = useQuery({
    queryKey: ['presets'],
    queryFn: () => native().store.getPresets(),
  })

  const updatePresetsMutation = useMutation({
    mutationFn: (newPresets: PresetSize[]) =>
      native().store.setPresets(newPresets),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['presets'] })
    },
  })

  const handleSave = async () => {
    const width = parseInt(newWidth)
    const height = parseInt(newHeight)

    if (isNaN(width) || isNaN(height)) {
      return
    }

    const newPresets = editingPreset
      ? presets.map((p) =>
          p.id === editingPreset.id ? { ...p, width, height } : p,
        )
      : [
          ...presets,
          {
            id: ulid(),
            width,
            height,
          },
        ]

    await updatePresetsMutation.mutateAsync(newPresets)
    handleClose()
  }

  const handleEdit = (preset: PresetSize) => {
    setEditingPreset(preset)
    setNewWidth(preset.width.toString())
    setNewHeight(preset.height.toString())
    setIsDialogOpen(true)
  }

  const handleDelete = (id: string) => {
    const newPresets = presets.filter((p) => p.id !== id)
    updatePresetsMutation.mutate(newPresets)
  }

  const handleClose = () => {
    setIsDialogOpen(false)
    setEditingPreset(null)
    setNewWidth('')
    setNewHeight('')
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Window Size Presets</CardTitle>
        <CardDescription>
          Manage your preset window sizes for quick resizing
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="mr-2 h-4 w-4" />
                Add Preset
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>
                  {editingPreset ? 'Edit Preset' : 'Add New Preset'}
                </DialogTitle>
                <DialogDescription>
                  Enter the dimensions for your window preset
                </DialogDescription>
              </DialogHeader>
              <form
                onSubmit={async (e) => {
                  e.preventDefault()
                  await handleSave()
                }}
              >
                <div className="grid gap-4 py-4">
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="width" className="text-right">
                      Width
                    </label>
                    <Input
                      id="width"
                      type="number"
                      className="col-span-3"
                      value={newWidth}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewWidth(e.target.value)
                      }
                    />
                  </div>
                  <div className="grid grid-cols-4 items-center gap-4">
                    <label htmlFor="height" className="text-right">
                      Height
                    </label>
                    <Input
                      id="height"
                      type="number"
                      className="col-span-3"
                      value={newHeight}
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setNewHeight(e.target.value)
                      }
                    />
                  </div>
                </div>
                <DialogFooter>
                  <Button variant="outline" type="button" onClick={handleClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    disabled={updatePresetsMutation.isPending}
                  >
                    Save
                  </Button>
                </DialogFooter>
              </form>
            </DialogContent>
          </Dialog>
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Width</TableHead>
              <TableHead>Height</TableHead>
              <TableHead className="w-[100px]">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {presets.map((preset) => (
              <TableRow key={preset.id}>
                <TableCell>{preset.width}px</TableCell>
                <TableCell>{preset.height}px</TableCell>
                <TableCell>
                  <div className="flex space-x-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleEdit(preset)}
                      disabled={updatePresetsMutation.isPending}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDelete(preset.id)}
                      disabled={updatePresetsMutation.isPending}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  )
}
