"use client";

import { useState } from "react";
import { Star, Trash2, ImageIcon } from "lucide-react";
import { PhotoUploader } from "@/components/photo-uploader";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";
import Image from "next/image";

interface ProgramPhoto {
  id: string;
  photo_type: string;
  sort_order?: number;
  photo: {
    id: string;
    filename: string;
    storage_url: string;
    width?: number;
    height?: number;
    size_kb?: number;
  };
}

interface ProgramImageManagerProps {
  userId: string;
  programId?: string; // undefined for create mode
  photos: ProgramPhoto[];
  onPhotosChange: () => void; // callback to reload photos
  onSetThumbnail?: (photoId: string) => void; // callback for create mode thumbnail setting
  isCreateMode: boolean;
}

export function ProgramImageManager({
  userId,
  programId,
  photos,
  onPhotosChange,
  onSetThumbnail,
  isCreateMode
}: ProgramImageManagerProps) {
  const [isUploading, setIsUploading] = useState(false);

  const handleDeletePhoto = async (photoId: string) => {
    if (!confirm('이 이미지를 삭제하시겠습니까?')) {
      return;
    }

    try {
      const supabase = createClient();
      
      // Delete from photos table
      const { error: photoError } = await supabase
        .from('photos')
        .delete()
        .eq('id', photoId);

      if (photoError) {
        console.error('Error deleting photo:', photoError);
        throw photoError;
      }

      // Reload photos
      onPhotosChange();
      toast.success('이미지가 삭제되었습니다.');
    } catch (error) {
      console.error('Error deleting photo:', error);
      toast.error('이미지 삭제에 실패했습니다.');
    }
  };

  const handleSetThumbnail = async (photoId: string) => {
    if (isCreateMode) {
      // In create mode, use the callback to let parent handle thumbnail setting
      if (onSetThumbnail) {
        onSetThumbnail(photoId);
        toast.success('썸네일이 설정되었습니다. 프로그램 저장 시 적용됩니다.');
      }
      return;
    }

    if (!programId) {
      toast.error('프로그램 ID가 없습니다.');
      return;
    }

    try {
      const supabase = createClient();

      // Update the programs table thumbnail reference
      const { error: programUpdateError } = await supabase
        .from('programs')
        .update({ thumbnail: photoId })
        .eq('id', programId);

      if (programUpdateError) {
        console.error('Error updating program thumbnail:', programUpdateError);
        throw programUpdateError;
      }

      // Reload photos to update UI
      onPhotosChange();
      toast.success('썸네일이 설정되었습니다.');
    } catch (error) {
      console.error('Error setting thumbnail:', error);
      toast.error('썸네일 설정에 실패했습니다.');
    }
  };

  const handleUploadComplete = async () => {
    setIsUploading(false);
    onPhotosChange();
  };

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-gray-900">이미지 관리</h3>
      
      <div className="space-y-4">
        <PhotoUploader 
          userId={userId}
          programId={programId}
          onUploadComplete={handleUploadComplete}
        />
        
        {/* Display existing photos */}
        {photos.length > 0 && (
          <div className="space-y-2">
            <h4 className="text-sm font-medium text-gray-700">업로드된 이미지 ({photos.length}개)</h4>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {photos.map((programPhoto, index) => {
                const photo = programPhoto.photo;
                console.log('Rendering photo:', photo);
                console.log('Photo storage_url:', photo?.storage_url);
                return (
                  <div key={programPhoto.id || index} className="relative group">
                    <div className={`w-full h-24 rounded-lg border flex items-center justify-center ${
                      programPhoto.photo_type === 'thumbnail' ? 'border-blue-500 border-2' : 'border-gray-200'
                    }`}>
                      {photo?.storage_url ? (
                        <Image
                          width={100}
                          height={100}
                          src={photo.storage_url}
                          alt={photo?.filename || 'Uploaded photo'}
                          className="w-full h-full object-cover rounded-lg"
                          onError={(e) => {
                            console.error('Image load error for:', photo?.filename);
                            console.error('Failed URL:', photo?.storage_url);
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                            const parent = target.parentElement;
                            if (parent) {
                              parent.innerHTML = `
                                <div class="flex flex-col items-center justify-center text-gray-400 text-xs">
                                  <svg class="w-6 h-6 mb-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                  </svg>
                                  <span>이미지 로딩 실패</span>
                                  <span class="text-xs">${photo?.filename}</span>
                                </div>
                              `;
                            }
                          }}
                          onLoad={() => {
                            console.log('Image loaded successfully:', photo?.filename);
                          }}
                        />
                      ) : (
                        <div className="flex flex-col items-center justify-center text-gray-400 text-xs">
                          <ImageIcon className="w-6 h-6 mb-1" />
                          <span>이미지 없음</span>
                        </div>
                      )}
                    </div>
                    
                    {/* Thumbnail badge */}
                    {programPhoto.photo_type === 'thumbnail' && (
                      <div className="absolute top-2 left-2 bg-blue-500 text-white px-2 py-1 rounded text-xs font-medium flex items-center gap-1">
                        <Star size={12} />
                        썸네일
                      </div>
                    )}

                    {/* Hover overlay with buttons */}
                    <div className="absolute inset-0 bg-opacity-50 group-hover:bg-opacity-70 transition-all rounded-lg flex items-center justify-center">
                      <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                        {/* Set as thumbnail button */}
                        {programPhoto.photo_type !== 'thumbnail' && (
                          <button
                            onClick={() => handleSetThumbnail(photo.id)}
                            className="bg-blue-500 hover:bg-blue-600 text-white p-2 rounded-lg transition-colors"
                            title="썸네일로 설정"
                          >
                            <Star size={16} />
                          </button>
                        )}
                        
                        {/* Delete button */}
                        <button
                          onClick={() => handleDeletePhoto(photo.id)}
                          className="bg-red-500 hover:bg-red-600 text-white p-2 rounded-lg transition-colors"
                          title="이미지 삭제"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}