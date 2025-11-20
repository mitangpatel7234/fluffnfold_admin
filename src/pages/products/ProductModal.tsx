
import React, { useState, useEffect } from 'react';
import { useApiService } from '@/services/api';
import { Product, Category, Feature, Include, CreateProductDto } from '@/types';
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

interface ProductModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: () => void;
  product?: Product | null;
  categories: Category[];
 
}

const ProductModal: React.FC<ProductModalProps> = ({
  isOpen,
  onClose,
  onSave,
  product,
  categories,
  
}) => {
  const { productApi } = useApiService();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<CreateProductDto>({
    name: '',
    description: '',
    pricePerKg: 0,
    savings: '',
    popular: false,
    categoryId: 0,
    featureIds: [],
    includeIds: []
  });

  useEffect(() => {
    if (product) {
      setFormData({
        name: product.name,
        description: product.description,
        pricePerKg: Number(product.pricePerKg) || 0,
        savings: product.savings ,
        popular: product.popular || false,
        categoryId: product.categoryId,
        featureIds: product.featureIds,
        includeIds: product.includeIds || []
      });
    } else {
      setFormData({
        name: '',
        description: '',
        pricePerKg: 0,
        savings: '',
        popular: false,
        categoryId: categories[0]?.id || 0,
        featureIds: [],
        includeIds: []
      });
    }
  }, [product, categories]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.description) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);
    try {
      if (product) {
        await productApi.update(product.id, formData);
        toast({
          title: "Success",
          description: "Product updated successfully",
        });
      } else {
        await productApi.create(formData);
        toast({
          title: "Success",
          description: "Product created successfully",
        });
      }
      onSave();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${product ? 'update' : 'create'} product`,
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {product ? 'Edit Product' : 'Create Product'}
          </DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="sm:col-span-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                placeholder="Enter product name"
                required
              />
            </div>

            <div className="sm:col-span-2">
              <Label htmlFor="description">Description *</Label>
              <textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Enter product description"
                className="w-full p-2 border border-gray-300 rounded-md min-h-[80px] resize-y"
                required
              />
            </div>

            

            <div>
              <Label htmlFor="price">Price per Kg</Label>
              <Input
                id="pricePerKg"
                type="number"
                step="1"
                min="1"
                value={formData.pricePerKg}
                onChange={(e) => setFormData(prev => ({ ...prev, pricePerKg: Number(e.target.value) }))}
                placeholder="10"
              />
            </div>

            <div>
              <Label htmlFor="savings">Savings</Label>
              <Input
                id="savings"
                value={formData.savings}
                onChange={(e) => setFormData(prev => ({ ...prev, savings: e.target.value }))}
                placeholder="ex.10% Off"
              />
            </div>

            <div>
              <Label htmlFor="category">Category *</Label>
              <select
                id="category"
                value={formData.categoryId}
                onChange={(e) => setFormData(prev => ({ ...prev, categoryId: Number(e.target.value) }))}
                className="w-full p-2 border border-gray-300 rounded-md"
                required
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="sm:col-span-2">
              <div className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  id="popular"
                  checked={formData.popular}
                  onChange={(e) => setFormData(prev => ({ ...prev, popular: e.target.checked }))}
                  className="rounded"
                />
                <Label htmlFor="popular">Popular Product</Label>
              </div>
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
              {loading ? (
                <LoadingSpinner size="sm" />
              ) : (
                product ? 'Update' : 'Create'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ProductModal;
