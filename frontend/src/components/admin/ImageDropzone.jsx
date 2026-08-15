import { useCallback } from 'react';
import { useDropzone } from 'react-dropzone';
import { HiOutlineUpload, HiOutlineX } from 'react-icons/hi';

const MAX_FILES = 8;
const MAX_SIZE = 5 * 1024 * 1024; // 5MB

/**
 * Combines existing (already-uploaded, from Cloudinary) images with newly
 * selected local files in one preview grid.
 *
 * @param existingImages [{url, publicId}] - images already on the product
 * @param newFiles       File[] - freshly selected files pending upload
 * @param onAddFiles     (File[]) => void
 * @param onRemoveExisting (publicId) => void
 * @param onRemoveNewFile (index) => void
 */
const ImageDropzone = ({
  existingImages = [],
  newFiles = [],
  onAddFiles,
  onRemoveExisting,
  onRemoveNewFile,
  error,
}) => {
  const totalCount = existingImages.length + newFiles.length;

  const onDrop = useCallback(
    (acceptedFiles) => {
      const room = MAX_FILES - totalCount;
      if (room <= 0) return;
      onAddFiles(acceptedFiles.slice(0, room));
    },
    [onAddFiles, totalCount]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: { 'image/jpeg': [], 'image/png': [], 'image/webp': [], 'image/avif': [] },
    maxSize: MAX_SIZE,
    disabled: totalCount >= MAX_FILES,
  });

  return (
    <div>
      <div
        {...getRootProps()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed px-6 py-8 text-center transition-colors ${
          isDragActive ? 'border-brand-500 bg-brand-50' : 'border-gray-300 hover:border-brand-400'
        } ${totalCount >= MAX_FILES ? 'cursor-not-allowed opacity-50' : ''}`}
      >
        <input {...getInputProps()} />
        <HiOutlineUpload className="h-8 w-8 text-gray-400" />
        <p className="mt-2 text-sm font-medium text-ink-700">
          {totalCount >= MAX_FILES ? 'Maximum 8 images reached' : 'Drag & drop images, or click to browse'}
        </p>
        <p className="mt-1 text-xs text-gray-400">JPEG, PNG, WEBP, or AVIF — up to 5MB each ({totalCount}/{MAX_FILES})</p>
      </div>
      {error && <p className="mt-1.5 text-xs font-medium text-red-500">{error}</p>}

      {(existingImages.length > 0 || newFiles.length > 0) && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {existingImages.map((img) => (
            <div key={img.publicId} className="group relative aspect-square overflow-hidden rounded-lg border border-gray-200">
              <img src={img.url} alt="" className="h-full w-full object-cover" />
              <button
                type="button"
                onClick={() => onRemoveExisting(img.publicId)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <HiOutlineX className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
          {newFiles.map((file, idx) => (
            <div key={idx} className="group relative aspect-square overflow-hidden rounded-lg border border-brand-300">
              <img src={URL.createObjectURL(file)} alt="" className="h-full w-full object-cover" />
              <span className="absolute bottom-1 left-1 rounded bg-brand-600 px-1.5 py-0.5 text-[10px] font-semibold text-white">
                New
              </span>
              <button
                type="button"
                onClick={() => onRemoveNewFile(idx)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white opacity-0 transition-opacity group-hover:opacity-100"
                aria-label="Remove image"
              >
                <HiOutlineX className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ImageDropzone;
