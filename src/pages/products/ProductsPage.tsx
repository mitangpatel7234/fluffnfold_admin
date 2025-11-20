import { useState, useEffect } from 'react';
import { useApiService } from '@/services/api';
import { Product, Category, Feature, Include } from '@/types';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { LoadingSpinner } from '@/components/ui/loading-spinner';
import { Plus, Edit, Trash2, Search } from 'lucide-react';
import { toast } from '@/hooks/use-toast';
import ProductModal from './ProductModal';
import { 
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';

const ProductsPage = () => {
  const { productApi, categoryApi } = useApiService();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  // Fetch products
  // Remove the duplicate loadProducts function

  // Fetch categories
  const loadCategories = async () => {
    try {
      const response = await categoryApi.getAllSimple();
      
      setCategories(response.data); // Ensure categories is always an array
    } catch (error) {
      console.error('Failed to load categories:', error);
    }
  };
// console.log(categories)
  useEffect(() => {
    loadProducts();
    loadCategories();
  }, []);

  const loadProducts = async (page = 1) => {
    setLoading(true);
    try {
      const response = await productApi.getAll(page, 10);
      setProducts(response.data || []); // Ensure products is always an array
      setTotalPages(response.totalPages);
      setCurrentPage(page);
    } catch {
      toast({ title: "Error", description: "Failed to load products", variant: "destructive" });
    } finally {
      setLoading(false);
    }
  };
  const getCategoryName = (categoryId: number) => {
    console.log(categories)
    console.log(categoryId)
    const category = categories.find((cat) => cat.id === categoryId);
    console.log(category)
    return category ? category.name : 'Unknown';
  };

  



  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this product?')) return;
    try {
      await productApi.delete(id);
      toast({ title: "Success", description: "Product deleted successfully" });
      loadProducts(currentPage);
    } catch {
      toast({ title: "Error", description: "Failed to delete product", variant: "destructive" });
    }
  };

  const filtered = products.filter(p =>
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const category = Array.isArray(categories) && editingProduct
    ? categories.find((c) => c.id === editingProduct.categoryId)
    : null;

  if (loading) {
    return <div className="flex items-center justify-center h-64"><LoadingSpinner size="lg" /></div>;
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Products</h1>
        <Button onClick={() => { setEditingProduct(null); setIsModalOpen(true); }} className="flex items-center gap-2 w-full sm:w-auto">
          <Plus className="h-4 w-4" /> Add Product
        </Button>
      </div>

      <Card>
        <CardHeader className="pb-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input 
              placeholder="Search products…" 
              value={searchTerm} 
              onChange={e => setSearchTerm(e.target.value)} 
              className="pl-10"
            />
          </div>
        </CardHeader>
        <CardContent>
          {filtered.length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500">No products found. Click "Add Product" to create a new product.</p>
            </div>
          ) : (
            <>
              {/* Desktop */}
              <div className="hidden lg:block overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      {['Name','Price','Popular','Category','Actions'].map(h => (
                        <th key={h} className="text-left py-3 px-4 font-medium text-gray-500">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {filtered.map(prod => (
                      <tr key={prod.id} className="border-b hover:bg-gray-50">
                        <td className="py-3 px-4 font-medium">{prod.name}</td>
                       
                        <td className="py-3 px-4">{prod.pricePerKg ? `$${prod.pricePerKg}` : '-'}</td>
                        <td className="py-3 px-4">
                          {prod.popular ? <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Popular</span> : <span className="text-gray-400">‑</span>}
                        </td>
                        <td className="py-3 px-4">{getCategoryName(prod.categoryId)|| 'Unknown'}</td>
                        <td className="py-3 px-4">
                          <div className="flex space-x-2">
                            <Button variant="outline" size="sm" onClick={() => { setEditingProduct(prod); setIsModalOpen(true); }}>
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="outline" size="sm" onClick={() => handleDelete(prod.id)}>
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Mobile */}
              <div className="lg:hidden space-y-4">
                {filtered.map(prod => (
                  <Card key={prod.id} className="border border-gray-200">
                    <CardContent className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-semibold text-base">{prod.name}</h3>
                          {prod.popular && <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded mt-1 inline-block">Popular</span>}
                        </div>
                        <div className="text-right">
                          
                          {prod.pricePerKg && <div className="text-sm text-gray-500">${prod.pricePerKg}</div>}
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 mb-2 line-clamp-2">{prod.description}</p>
                      <div className="flex justify-between text-xs text-gray-500 mb-3">
                        <span>Category: {getCategoryName(prod.categoryId) || 'Unknown'}</span>
                        {prod.savings && <span className="text-orange-600">Save: {prod.savings}</span>}
                      </div>
                      <div className="flex space-x-2">
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => { setEditingProduct(prod); setIsModalOpen(true); }}>
                          <Edit className="h-4 w-4 mr-1" /> Edit
                        </Button>
                        <Button variant="outline" size="sm" className="flex-1" onClick={() => handleDelete(prod.id)}>
                          <Trash2 className="h-4 w-4 mr-1" /> Delete
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6">
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious onClick={() => currentPage > 1 && loadProducts(currentPage - 1)}
                      className={currentPage <= 1 ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <PaginationItem key={page}>
                      <PaginationLink onClick={() => loadProducts(page)} isActive={page === currentPage} className="cursor-pointer">
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  ))}
                  <PaginationItem>
                    <PaginationNext onClick={() => currentPage < totalPages && loadProducts(currentPage + 1)}
                      className={currentPage >= totalPages ? 'pointer-events-none opacity-50' : 'cursor-pointer'} />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
            </div>
          )}
        </CardContent>
      </Card>

      <ProductModal 
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onSave={() => { setIsModalOpen(false); loadProducts(currentPage); }}
        product={editingProduct}
        categories={categories}
      />
    </div>
  );
};

export default ProductsPage;