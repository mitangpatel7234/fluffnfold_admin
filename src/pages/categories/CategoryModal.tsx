
// import React, { useState, useEffect } from 'react';
// import { useApiService } from '@/services/api';
// import { Category, Feature, CreateCategoryDto } from '@/types';
// import { Button } from '@/components/ui/button';
// import { Input } from '@/components/ui/input';
// import { Label } from '@/components/ui/label';
// import { 
//   Dialog, 
//   DialogContent, 
//   DialogHeader, 
//   DialogTitle 
// } from '@/components/ui/dialog';
// import { toast } from '@/hooks/use-toast';
// import { LoadingSpinner } from '@/components/ui/loading-spinner';

// interface CategoryModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   onSave: () => void;
//   category?: Category | null;
//   features: Feature[];
// }

// const CategoryModal: React.FC<CategoryModalProps> = ({
//   isOpen,
//   onClose,
//   onSave,
//   category,
//   features
// }) => {
//   const { categoryApi } = useApiService();
//   const [loading, setLoading] = useState(false);
//   const [formData, setFormData] = useState<CreateCategoryDto>({
//     name: '',
//     description: '',
//     featureIds: []
//   });
// console.log(features)
//   useEffect(() => {
//     if (category) {
//       setFormData({
//         name: category.name,
//         description: category.description || '',
//         featureIds: category.featureIds || []
//       });
//     } else {
//       setFormData({
//         name: '',
//         description: '',
//         featureIds: []
//       });
//     }
//   }, [category]);

//   const handleSubmit = async (e: React.FormEvent) => {
//     e.preventDefault();
    
//     if (!formData.name || !formData.description) {
//       toast({
//         title: "Error",
//         description: "Please fill in all required fields",
//         variant: "destructive",
//       });
//       return;
//     }

//     setLoading(true);
//     try {
//       if (category) {
//         await categoryApi.update(category.id, formData);
//         toast({
//           title: "Success",
//           description: "Category updated successfully",
//         });
//       } else {
//         await categoryApi.create(formData);
//         toast({
//           title: "Success",
//           description: "Category created successfully",
//         });
//       }
//       onSave();
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: `Failed to ${category ? 'update' : 'create'} category`,
//         variant: "destructive",
//       });
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleFeatureToggle = (featureId: number) => {
//     setFormData(prev => ({
//       ...prev,
//       featureIds: prev.featureIds?.includes(featureId)
//         ? prev.featureIds.filter(id => id !== featureId)
//         : [...(prev.featureIds || []), featureId]
//     }));
//   };

//   return (
//     <Dialog open={isOpen} onOpenChange={onClose}>
//       <DialogContent className="sm:max-w-md">
//         <DialogHeader>
//           <DialogTitle>
//             {category ? 'Edit Category' : 'Create Category'}
//           </DialogTitle>
//         </DialogHeader>
        
//         <form onSubmit={handleSubmit} className="space-y-4">
//           <div>
//             <Label htmlFor="name">Name *</Label>
//             <Input
//               id="name"
//               value={formData.name}
//               onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
//               placeholder="Enter category name"
//               required
//             />
//           </div>

//           <div>
//             <Label htmlFor="description">Description *</Label>
//             <textarea
//               id="description"
//               value={formData.description}
//               onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
//               placeholder="Enter category description"
//               className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] resize-y"
//               required
//             />
//           </div>

//           <div>
//             <Label>Features</Label>
//             <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
//               {features.map(feature => (
//                 <label key={feature.id} className="flex items-center space-x-2">
//                   <input
//                     type="checkbox"
//                     checked={formData.featureIds?.includes(feature.id)}
//                     onChange={() => handleFeatureToggle(feature.id)}
//                     className="rounded"
                    
//                   />
//                   <span className="text-sm">{feature.name}</span>
//                 </label>
//               ))}
//             </div>
//           </div>

//           <div className="flex space-x-2 pt-4">
//             <Button
//               type="button"
//               variant="outline"
//               onClick={onClose}
//               className="flex-1"
//               disabled={loading}
//             >
//               Cancel
//             </Button>
//             <Button
//               type="submit"
//               className="flex-1"
//               disabled={loading}
//             >
//               {loading ? (
//                 <LoadingSpinner size="sm" />
//               ) : (
//                 category ? 'Update' : 'Create'
//               )}
//             </Button>
//           </div>
//         </form>
//       </DialogContent>
//     </Dialog>
//   );
// };

// export default CategoryModal;




import React, { useEffect, useState } from 'react';
import { Category, Feature, CreateCategoryDto } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog';
import { toast } from '@/hooks/use-toast';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { useApiService } from '@/services/api';

interface CategoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  category?: any | null;
  features: Feature[];
}

const CategoryModal: React.FC<CategoryModalProps> = ({
  isOpen,
  onClose,
  onSave,
  category,
  features
}) => {
  const { categoryApi } = useApiService();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateCategoryDto>({
    name: '',
    description: '',
    featureIds: [],
  });

  useEffect(() => {
    if (category) {
      // Convert feature objects to ids if features array is present
      const featureIds = category.features
        ? category.features.map((f) => f.id)
        : category.featureIds || [];

      setFormData({
        name: category.name,
        description: category.description || '',
        featureIds,
      });
    } else {
      setFormData({
        name: '',
        description: '',
        featureIds: [],
      });
    }
  }, [category]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.description) {
      toast({
        title: 'Error',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }

    setLoading(true);
    try {
      if (category) {
        await categoryApi.update(category.id, formData);
        toast({
          title: 'Success',
          description: 'Category updated successfully',
        });
      } else {
        await categoryApi.create(formData);
        toast({
          title: 'Success',
          description: 'Category created successfully',
        });
      }
      onSave();
      onClose();
    } catch (error) {
      toast({
        title: 'Error',
        description: `Failed to ${category ? 'update' : 'create'} category`,
        variant: 'destructive',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleFeatureToggle = (featureId: number) => {
    setFormData((prev) => ({
      ...prev,
      featureIds: prev.featureIds.includes(featureId)
        ? prev.featureIds.filter((id) => id !== featureId)
        : [...prev.featureIds, featureId],
    }));
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {category ? 'Edit Category' : 'Create Category'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, name: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label htmlFor="description">Description *</Label>
            <textarea
              id="description"
              className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] resize-y"
              value={formData.description}
              onChange={(e) =>
                setFormData((prev) => ({ ...prev, description: e.target.value }))
              }
              required
            />
          </div>

          <div>
            <Label>Features</Label>
            <div className="space-y-2 max-h-32 overflow-y-auto border border-gray-200 rounded-md p-2">
              {features.map((feature) => (
                <label key={feature.id} className="flex items-center space-x-2">
                  <input
                    type="checkbox"
                    checked={formData.featureIds.includes(feature.id)}
                    onChange={() => handleFeatureToggle(feature.id)}
                  />
                  <span className="text-sm">{feature.name}</span>
                </label>
              ))}
            </div>
          </div>

          <div className="flex space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              className="flex-1"
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading}
            >
              {loading ? <LoadingSpinner size="sm" /> : category ? 'Update' : 'Create'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default CategoryModal;
