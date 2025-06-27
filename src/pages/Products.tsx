
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { useApi } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';

interface Product {
  id: number;
  name: string;
  pricePerKg: number;
  description: string;
  categoryId: number;
  featureIds: number[];
  createdAt: string;
  updatedAt: string;
}

interface Category {
  id: number;
  name: string;
}

interface Feature {
  id: number;
  name: string;
}

const Products = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [features, setFeatures] = useState<Feature[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [saving, setSaving] = useState(false);
  const { makeRequest } = useApi();

  const [formData, setFormData] = useState({
    name: '',
    pricePerKg: '',
    description: '',
    categoryId: '',
    featureIds: [] as number[],
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [productsData, categoriesData, featuresData] = await Promise.all([
        makeRequest('/products/'),
        makeRequest('/categories/'),
        makeRequest('/features/'),
      ]);

      setProducts(productsData || []);
      setCategories(categoriesData || []);
      setFeatures(featuresData || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setFormData({
      name: '',
      pricePerKg: '',
      description: '',
      categoryId: '',
      featureIds: [],
    });
  };

  const openAddModal = () => {
    resetForm();
    setIsAddModalOpen(true);
  };

  const openEditModal = (product: Product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      pricePerKg: product.pricePerKg.toString(),
      description: product.description,
      categoryId: product.categoryId.toString(),
      featureIds: product.featureIds,
    });
    setIsEditModalOpen(true);
  };

  const handleFeatureToggle = (featureId: number) => {
    setFormData(prev => ({
      ...prev,
      featureIds: prev.featureIds.includes(featureId)
        ? prev.featureIds.filter(id => id !== featureId)
        : [...prev.featureIds, featureId]
    }));
  };

  const saveProduct = async () => {
    if (!formData.name || !formData.pricePerKg || !formData.categoryId) {
      toast({
        title: "Error",
        description: "Please fill in all required fields",
        variant: "destructive",
      });
      return;
    }

    setSaving(true);
    try {
      const payload = {
        name: formData.name,
        pricePerKg: parseFloat(formData.pricePerKg),
        description: formData.description,
        categoryId: parseInt(formData.categoryId),
        featureIds: formData.featureIds,
      };

      if (editingProduct) {
        await makeRequest(`/products/${editingProduct.id}`, {
          method: 'PUT',
          body: JSON.stringify(payload),
        });
        setIsEditModalOpen(false);
        setEditingProduct(null);
      } else {
        await makeRequest('/products/', {
          method: 'POST',
          body: JSON.stringify(payload),
        });
        setIsAddModalOpen(false);
      }

      toast({
        title: "Success",
        description: `Product ${editingProduct ? 'updated' : 'added'} successfully`,
      });

      resetForm();
      fetchData();
    } catch (error) {
      toast({
        title: "Error",
        description: `Failed to ${editingProduct ? 'update' : 'add'} product`,
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const getCategoryName = (categoryId: number) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'Unknown';
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <p className="text-gray-600 mt-2">Manage your product catalog</p>
        </div>
        <Button onClick={openAddModal}>Add Product</Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Products</CardTitle>
          <CardDescription>
            {products.length} product(s) in catalog
          </CardDescription>
        </CardHeader>
        <CardContent>
          {products.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No products added yet</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Price/Kg</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Category</TableHead>
                  <TableHead>Features</TableHead>
                  <TableHead>Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>₹{product.pricePerKg}</TableCell>
                    <TableCell className="max-w-xs truncate">{product.description}</TableCell>
                    <TableCell>{getCategoryName(product.categoryId)}</TableCell>
                    <TableCell>{product.featureIds.length} features</TableCell>
                    <TableCell>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => openEditModal(product)}
                      >
                        Edit
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Modal */}
      <Dialog open={isAddModalOpen || isEditModalOpen} onOpenChange={(open) => {
        if (!open) {
          setIsAddModalOpen(false);
          setIsEditModalOpen(false);
          setEditingProduct(null);
          resetForm();
        }
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{editingProduct ? 'Edit Product' : 'Add Product'}</DialogTitle>
            <DialogDescription>
              {editingProduct ? 'Update product information' : 'Add a new product to your catalog'}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="Product name"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="price">Price per Kg *</Label>
                <Input
                  id="price"
                  type="number"
                  step="0.01"
                  value={formData.pricePerKg}
                  onChange={(e) => setFormData(prev => ({ ...prev, pricePerKg: e.target.value }))}
                  placeholder="0.00"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Product description"
                rows={3}
              />
            </div>

            <div className="space-y-2">
              <Label>Category *</Label>
              <Select value={formData.categoryId} onValueChange={(value) => setFormData(prev => ({ ...prev, categoryId: value }))}>
                <SelectTrigger>
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category.id} value={category.id.toString()}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Features</Label>
              <div className="grid grid-cols-2 gap-2 max-h-32 overflow-y-auto border rounded-md p-2">
                {features.map((feature) => (
                  <div key={feature.id} className="flex items-center space-x-2">
                    <Checkbox
                      id={`feature-${feature.id}`}
                      checked={formData.featureIds.includes(feature.id)}
                      onCheckedChange={() => handleFeatureToggle(feature.id)}
                    />
                    <label htmlFor={`feature-${feature.id}`} className="text-sm cursor-pointer">
                      {feature.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button 
                onClick={saveProduct} 
                disabled={saving}
                className="flex-1"
              >
                {saving ? "Saving..." : (editingProduct ? "Update" : "Add Product")}
              </Button>
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsAddModalOpen(false);
                  setIsEditModalOpen(false);
                  setEditingProduct(null);
                  resetForm();
                }}
                className="flex-1"
              >
                Cancel
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Products;
