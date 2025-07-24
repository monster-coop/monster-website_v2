"use client"

import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload, X, CheckCircle, AlertCircle } from "lucide-react"
import { uploadMultiplePhotos } from "@/lib/photos/upload"
import { Progress } from "@/components/ui/progress"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { toast } from "sonner"

interface PhotoUploaderProps {
  userId: string
  programId?: string // Optional program ID to link photos to
  onUploadComplete: () => void
}

interface UploadResult {
  success: boolean
  file?: File
  error?: any
  metadata?: any
}

export function PhotoUploader({ userId, programId, onUploadComplete }: PhotoUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState<Record<number, number>>({})
  const [uploadResults, setUploadResults] = useState<UploadResult[]>([])

  const onDrop = useCallback(
    async (acceptedFiles: File[]) => {
      setUploading(true)
      setUploadProgress({})
      setUploadResults([])

      const results = await uploadMultiplePhotos(
        acceptedFiles, 
        userId, 
        (fileIndex, progress) => {
          setUploadProgress((prev) => ({
            ...prev,
            [fileIndex]: progress,
          }))
        },
        { programId }
      )

      setUploadResults(results)
      setUploading(false)
      
      // Show toast notification
      const successCount = results.filter((r) => r.success).length
      const errorCount = results.filter((r) => !r.success).length
      
      if (successCount > 0 && errorCount === 0) {
        toast.success(`${successCount}개의 사진을 성공적으로 업로드했습니다.`)
      } else if (successCount > 0 && errorCount > 0) {
        toast.warning(`${successCount}개 업로드 성공, ${errorCount}개 실패`)
      } else if (errorCount > 0) {
        toast.error(`${errorCount}개의 사진 업로드에 실패했습니다.`)
      }
      
      onUploadComplete()
    },
    [userId, onUploadComplete],
  )

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".webp"],
    },
    multiple: true,
  })

  const clearResults = () => {
    setUploadResults([])
  }

  const successCount = uploadResults.filter((r) => r.success).length
  const errorCount = uploadResults.filter((r) => !r.success).length

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={cn(
          "border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors",
          isDragActive ? "border-primary bg-primary/5" : "border-muted-foreground/25 hover:border-primary",
          uploading && "pointer-events-none opacity-50",
        )}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
        {isDragActive ? (
          <p>여기에 사진을 놓으세요...</p>
        ) : (
          <div>
            <p className="text-lg font-medium">여기에 사진을 놓으세요, 또는 클릭하여 선택하세요</p>
            <p className="text-sm text-muted-foreground mt-1">
              JPEG, PNG, WebP 지원 • 압축 후 최대 1.5MB 파일 크기
            </p>
          </div>
        )}
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="space-y-2">
          <h4 className="text-sm font-medium">업로드 중 {Object.keys(uploadProgress).length} 파일...</h4>
          {Object.entries(uploadProgress).map(([index, progress]) => (
            <div key={index} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span>파일 {Number.parseInt(index) + 1}</span>
                <span>{Math.round(progress)}%</span>
              </div>
              <Progress value={progress} className="h-2" />
            </div>
          ))}
        </div>
      )}

      {/* Upload Results - Simple display without Alert component */}
      {uploadResults.length > 0 && (
        <div className={`p-4 rounded-lg border ${successCount === uploadResults.length ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"}`}>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              {successCount === uploadResults.length ? (
                <CheckCircle className="h-4 w-4 text-green-600" />
              ) : (
                <AlertCircle className="h-4 w-4 text-yellow-600" />
              )}
              <span className="text-sm">
                {successCount} 개의 사진을 성공적으로 업로드했습니다.
                {errorCount > 0 && ` (${errorCount}개 실패)`}
              </span>
            </div>
            <Button variant="ghost" size="sm" onClick={clearResults}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}
    </div>
  )
}
