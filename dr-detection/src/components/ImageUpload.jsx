import { useState, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Upload, X, AlertCircle, Camera, Image as ImageIcon } from 'lucide-react';
import './ImageUpload.css';

/**
 * ImageUpload Component
 *
 * A professional medical image upload component with:
 * - Click to browse, drag-and-drop, and mobile camera support
 * - File validation (type, size)
 * - Image preview with clear functionality
 * - Error handling and loading states
 * - Automatic image compression for large files
 */
const ImageUpload = ({ onImageSelect, maxSizeMB = 10, compressionThresholdMB = 2 }) => {
  // State management
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [isDragging, setIsDragging] = useState(false);

  // Refs
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);
  const dropZoneRef = useRef(null);

  // Accepted file types
  const ACCEPTED_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];
  const MAX_SIZE_BYTES = maxSizeMB * 1024 * 1024;
  const COMPRESSION_THRESHOLD = compressionThresholdMB * 1024 * 1024;

  /**
   * Validates file type and size
   */
  const validateFile = (file) => {
    if (!file) {
      return 'No file selected';
    }

    // Check file type
    if (!ACCEPTED_TYPES.includes(file.type)) {
      return 'Invalid file type. Please upload a JPG, JPEG, or PNG image.';
    }

    // Check file size
    if (file.size > MAX_SIZE_BYTES) {
      return `File size exceeds ${maxSizeMB}MB limit. Please choose a smaller image.`;
    }

    return null;
  };

  /**
   * Compresses image if it exceeds threshold
   */
  const compressImage = async (file) => {
    // Skip compression if file is already small
    if (file.size <= COMPRESSION_THRESHOLD) {
      return file;
    }

    return new Promise((resolve, reject) => {
      const reader = new FileReader();

      reader.onload = (e) => {
        const img = new Image();

        img.onload = () => {
          // Create canvas
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Calculate new dimensions (max 1920px width/height while maintaining aspect ratio)
          const MAX_DIMENSION = 1920;
          let width = img.width;
          let height = img.height;

          if (width > height && width > MAX_DIMENSION) {
            height = (height * MAX_DIMENSION) / width;
            width = MAX_DIMENSION;
          } else if (height > MAX_DIMENSION) {
            width = (width * MAX_DIMENSION) / height;
            height = MAX_DIMENSION;
          }

          canvas.width = width;
          canvas.height = height;

          // Draw and compress
          ctx.drawImage(img, 0, 0, width, height);

          // Convert to blob with quality reduction
          canvas.toBlob(
            (blob) => {
              if (blob) {
                // Create new file from blob
                const compressedFile = new File(
                  [blob],
                  file.name,
                  { type: file.type, lastModified: Date.now() }
                );
                resolve(compressedFile);
              } else {
                reject(new Error('Compression failed'));
              }
            },
            file.type,
            0.85 // Quality (85%)
          );
        };

        img.onerror = () => reject(new Error('Failed to load image'));
        img.src = e.target.result;
      };

      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsDataURL(file);
    });
  };

  /**
   * Processes and validates the selected file
   */
  const processFile = useCallback(async (file) => {
    if (!file) return;

    // Clear previous errors
    setError(null);
    setLoading(true);

    try {
      // Validate file
      const validationError = validateFile(file);
      if (validationError) {
        setError(validationError);
        setLoading(false);
        return;
      }

      // Compress image if necessary
      let processedFile = file;
      if (file.size > COMPRESSION_THRESHOLD) {
        try {
          processedFile = await compressImage(file);
        } catch (compressionError) {
          console.error('Compression failed, using original file:', compressionError);
          // Continue with original file if compression fails
        }
      }

      // Create preview URL
      const previewURL = URL.createObjectURL(processedFile);

      // Update state
      setSelectedFile(processedFile);
      setPreview(previewURL);
      setLoading(false);

      // Callback to parent component
      if (onImageSelect) {
        onImageSelect(processedFile, previewURL);
      }
    } catch (err) {
      setError('Failed to process image. Please try again.');
      setLoading(false);
      console.error('File processing error:', err);
    }
  }, [onImageSelect]);

  /**
   * Handles file input change (browse/camera)
   */
  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  /**
   * Handles drag over event
   */
  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  /**
   * Handles drag leave event
   */
  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Only set dragging to false if leaving the drop zone entirely
    if (!dropZoneRef.current?.contains(e.relatedTarget)) {
      setIsDragging(false);
    }
  };

  /**
   * Handles file drop
   */
  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  /**
   * Clears selection and resets state
   */
  const clearSelection = () => {
    // Revoke object URL to prevent memory leaks
    if (preview) {
      URL.revokeObjectURL(preview);
    }

    setSelectedFile(null);
    setPreview(null);
    setError(null);
    setLoading(false);
    setIsDragging(false);

    // Reset file inputs
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (cameraInputRef.current) cameraInputRef.current.value = '';

    // Callback to parent
    if (onImageSelect) {
      onImageSelect(null, null);
    }
  };

  /**
   * Opens file browser
   */
  const openFileBrowser = () => {
    fileInputRef.current?.click();
  };

  /**
   * Opens camera (mobile)
   */
  const openCamera = () => {
    cameraInputRef.current?.click();
  };

  return (
    <div className="image-upload-container">
      {/* Hidden file inputs */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        onChange={handleFileChange}
        className="image-upload-input"
        aria-label="Upload image from gallery"
      />
      <input
        ref={cameraInputRef}
        type="file"
        accept="image/jpeg,image/jpg,image/png"
        capture="environment"
        onChange={handleFileChange}
        className="image-upload-input"
        aria-label="Take photo with camera"
      />

      {/* Upload box */}
      <motion.div
        ref={dropZoneRef}
        className={`upload-box ${isDragging ? 'upload-box--dragging' : ''} ${
          preview ? 'upload-box--has-image' : ''
        }`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={!preview && !loading ? openFileBrowser : undefined}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <AnimatePresence mode="wait">
          {loading ? (
            // Loading state
            <motion.div
              key="loading"
              className="upload-state upload-state--loading"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="loading-spinner"
                animate={{ rotate: 360 }}
                transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              >
                <Upload size={40} />
              </motion.div>
              <p className="upload-message">Processing image...</p>
            </motion.div>
          ) : preview ? (
            // Preview state
            <motion.div
              key="preview"
              className="upload-state upload-state--preview"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
            >
              <img src={preview} alt="Preview" className="preview-image" />

              {/* Clear button */}
              <motion.button
                className="clear-button"
                onClick={(e) => {
                  e.stopPropagation();
                  clearSelection();
                }}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                aria-label="Clear image"
              >
                <X size={20} />
              </motion.button>

              {/* File info overlay */}
              <div className="preview-info">
                <span className="preview-filename">{selectedFile?.name}</span>
                <span className="preview-filesize">
                  {(selectedFile?.size / 1024 / 1024).toFixed(2)} MB
                </span>
              </div>
            </motion.div>
          ) : (
            // Empty state
            <motion.div
              key="empty"
              className="upload-state upload-state--empty"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="upload-icon"
                initial={{ y: 0 }}
                animate={{ y: [0, -8, 0] }}
                whileHover={{ scale: 1.15 }}
                transition={{ 
                  duration: 2, 
                  repeat: Infinity, 
                  ease: 'easeInOut',
                  repeatType: 'loop'
                }}
              >
                <Upload size={48} />
              </motion.div>

              <h3 className="upload-title">Upload Retinal Image</h3>
              <p className="upload-subtitle">
                Drag and drop your image here, or click to browse
              </p>

              {/* Action buttons */}
              <div className="upload-actions">
                <motion.button
                  className="upload-action-btn upload-action-btn--primary"
                  onClick={(e) => {
                    e.stopPropagation();
                    openFileBrowser();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <ImageIcon size={18} />
                  Choose from Gallery
                </motion.button>

                {/* Show camera button on mobile */}
                <motion.button
                  className="upload-action-btn upload-action-btn--secondary mobile-only"
                  onClick={(e) => {
                    e.stopPropagation();
                    openCamera();
                  }}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Camera size={18} />
                  Take Photo
                </motion.button>
              </div>

              {/* Supported formats */}
              <div className="upload-formats">
                <span>JPG</span>
                <span>JPEG</span>
                <span>PNG</span>
                <span>Max {maxSizeMB}MB</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Error message */}
      <AnimatePresence>
        {error && (
          <motion.div
            className="error-message"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <AlertCircle size={18} />
            <span>{error}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ImageUpload;
