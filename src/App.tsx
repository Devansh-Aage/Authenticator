import { useState } from 'react'
import { InboxOutlined, UploadOutlined, LoadingOutlined } from '@ant-design/icons'
import { toast, ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'
import './App.css'
import testData from '../test.json'

interface UploadResponse {
  success: boolean
  message: string
  data?: any
}

function App() {
  const [selectedImage, setSelectedImage] = useState<File | null>(null)
  const [imagePreview, setImagePreview] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [uploadResponse, setUploadResponse] = useState<UploadResponse | null>(null)

  // Get expected values from test.json (first object in the array)
  const expectedValues = testData[0]

  // Function to compare values and return mismatched keys
  const getMismatchedKeys = (responseData: any, expectedData: any) => {
    const mismatched: string[] = []
    for (const key in expectedData) {
      if (responseData[key] !== expectedData[key]) {
        mismatched.push(key)
      }
    }
    return mismatched
  }

  // Function to render only mismatched fields
  const renderMismatchedFields = (data: any, mismatchedKeys: string[]) => {
    return mismatchedKeys.map((key) => {
      const value = data[key]
      const expectedValue = expectedValues[key]

      return (
        <div key={key} className="p-4 rounded-lg border-2 border-red-200 bg-red-50">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-semibold text-gray-800 capitalize">
              {key.replace(/([A-Z])/g, ' $1').trim()}
            </h4>
            <span className="bg-red-500 text-white px-2 py-1 rounded-full text-xs font-medium">
              Mismatch
            </span>
          </div>

          <div className="space-y-2">
            <div>
              <label className="text-sm font-medium text-gray-600">Expected:</label>
              <p className="text-gray-800 bg-white p-2 rounded border">
                {expectedValue}
              </p>
            </div>

            <div>
              <label className="text-sm font-medium text-gray-600">Found:</label>
              <p className="p-2 rounded border bg-red-100 border-red-300 text-red-800">
                {value}
              </p>
            </div>
          </div>
        </div>
      )
    })
  }

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setUploadResponse(null) // Clear previous response
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    const file = event.dataTransfer.files[0]
    if (file && file.type.startsWith('image/')) {
      setSelectedImage(file)
      const reader = new FileReader()
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string)
      }
      reader.readAsDataURL(file)
      setUploadResponse(null) // Clear previous response
    }
  }

  const handleUploadToServer = async () => {
    if (!selectedImage) return

    setIsUploading(true)
    setUploadResponse(null)

    // Show loading toast
    const toastId = toast.loading('Processing image...', {
      position: "top-right",
      autoClose: false,
      hideProgressBar: false,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
    })

    try {
      // Simulate API call with 5-second timeout
      await new Promise(resolve => setTimeout(resolve, 5000))

      const result: UploadResponse = {
        success: true,
        message: 'Image processed successfully',
        data: {
          "clgNAme": "KJSIT",
          "name": "Sidhesh Shah",
          "email": "sidheshshah@gmail.com",
          "phone": "9876543217",
          "address": "1237, Main St, Anytown, USA",
          "city": "Anytown",
          "state": "CA",
          "zip": "12345",
          "country": "USA"
        }
      }

      setUploadResponse(result)

      // Update toast to success
      toast.update(toastId, {
        render: 'Image processed successfully!',
        type: 'success',
        autoClose: 3000,
        isLoading: false,
      })
    } catch (error) {
      setUploadResponse({
        success: false,
        message: 'Upload failed. Please try again.',
        data: { error: error instanceof Error ? error.message : 'Unknown error' }
      })

      // Update toast to error
      toast.update(toastId, {
        render: 'Upload failed. Please try again.',
        type: 'error',
        autoClose: 3000,
        isLoading: false,
      })
    } finally {
      setIsUploading(false)
    }
  }

  const resetUpload = () => {
    setSelectedImage(null)
    setImagePreview(null)
    setUploadResponse(null)
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 text-center mb-8">
          Academia Autheniticator
        </h1>

        <div className={`grid gap-8 ${selectedImage ? 'grid-cols-1 lg:grid-cols-2' : 'grid-cols-1'}`}>
          {/* Upload Section */}
          <div className="space-y-6">
            {!selectedImage ? (
              <div
                className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center hover:border-blue-400 transition-colors cursor-pointer"
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => document.getElementById('file-input')?.click()}
              >
                <InboxOutlined className="text-4xl text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-700 mb-2">
                  Click or drag file to this area to upload
                </p>
                <p className="text-sm text-gray-500 mb-4">
                  Support for single image upload
                </p>
                <div className="flex justify-center space-x-2">
                  <span className="text-white px-3 py-1 rounded-md bg-red-500 text-sm">
                    JPG
                  </span>
                  <span className="text-white px-3 py-1 rounded-md bg-green-500 text-sm">
                    JPEG
                  </span>
                  <span className="text-white px-3 py-1 rounded-md bg-blue-500 text-sm">
                    PNG
                  </span>
                </div>
                <input
                  id="file-input"
                  type="file"
                  accept="image/*"
                  onChange={handleImageSelect}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="space-y-4">
                {/* Image Preview */}
                <div className="relative">
                  <img
                    src={imagePreview!}
                    alt="Preview"
                    className="w-full h-64 object-cover rounded-lg shadow-md"
                  />
                  <button
                    onClick={resetUpload}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-8 h-8 flex items-center justify-center hover:bg-red-600 transition-colors"
                  >
                    X
                  </button>
                </div>

                {/* Upload Button */}
                <button
                  onClick={handleUploadToServer}
                  disabled={isUploading}
                  className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 disabled:bg-blue-400 disabled:cursor-not-allowed transition-colors flex items-center justify-center space-x-2"
                >
                  {isUploading ? (
                    <>
                      <LoadingOutlined className="animate-spin" />
                      <span>Processing...</span>
                    </>
                  ) : (
                    <>
                      <UploadOutlined />
                      <span>Upload to Server</span>
                    </>
                  )}
                </button>
              </div>
            )}
          </div>

          {/* Response Section - Only show when image is uploaded */}
          {selectedImage && (
            <div className="space-y-6">

              {uploadResponse ? (
                <div className="bg-white rounded-lg shadow-md p-6">
                  <div className="space-y-3">
                    {uploadResponse.data && (
                      <div>
                        <div className="mb-4">
                          {(() => {
                            const mismatchedKeys = getMismatchedKeys(uploadResponse.data, expectedValues)
                            const hasMismatches = mismatchedKeys.length > 0

                            return (
                              <div className={`p-4 rounded-lg border-2 ${hasMismatches ? 'border-red-200 bg-red-50' : 'border-green-200 bg-green-50'}`}>
                                <div className="flex items-center space-x-3">
                                  <div className={`w-4 h-4 rounded-full ${hasMismatches ? 'bg-red-500' : 'bg-green-500'}`}></div>
                                  <div>
                                    <h3 className={`font-semibold ${hasMismatches ? 'text-red-800' : 'text-green-800'}`}>
                                      {hasMismatches ? 'Data Mismatch Detected' : 'All Data Matches'}
                                    </h3>
                                    <p className={`text-sm ${hasMismatches ? 'text-red-600' : 'text-green-600'}`}>
                                      {hasMismatches
                                        ? `Your data from the document doesn't match. ${mismatchedKeys.length} field(s) have discrepancies.`
                                        : 'All extracted data matches the expected values perfectly!'
                                      }
                                    </p>
                                  </div>
                                </div>
                              </div>
                            )
                          })()}
                        </div>

                        {(() => {
                          const mismatchedKeys = getMismatchedKeys(uploadResponse.data, expectedValues)
                          return mismatchedKeys.length > 0 && (
                            <div>
                              <label className="block text-sm font-medium text-gray-700 mb-3">Fields with Mismatches:</label>
                              <div className="space-y-4">
                                {renderMismatchedFields(uploadResponse.data, mismatchedKeys)}
                              </div>
                            </div>
                          )
                        })()}
                      </div>
                    )}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-lg shadow-md p-6 text-center">
                  <div className="text-gray-400 mb-2">
                    <svg className="w-12 h-12 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <p className="text-gray-500">Click "Upload to Server" to see the response</p>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
      <ToastContainer />
    </div>
  )
}

export default App
