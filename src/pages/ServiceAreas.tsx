import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useApi } from '@/hooks/useApi';
import { toast } from '@/hooks/use-toast';

interface ServiceArea {
  id: number;
  pincode: string;
  areas: string[];
  createdAt: string;
  updatedAt: string;
}

const ServiceAreas = () => {
  const [serviceAreas, setServiceAreas] = useState<ServiceArea[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [selectedServiceArea, setSelectedServiceArea] = useState<ServiceArea | null>(null);
  const [pincode, setPincode] = useState('');
  const [areasInput, setAreasInput] = useState('');
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<number | null>(null);
  const { makeRequest } = useApi();

  useEffect(() => {
    fetchServiceAreas();
  }, []);

  const fetchServiceAreas = async () => {
    try {
      const data = await makeRequest('/service-area/');
      setServiceAreas(data || []);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch service areas",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const saveServiceArea = async () => {
    if (!pincode.trim() || pincode.length !== 5) {
      toast({
        title: "Error",
        description: "Please enter a valid 5-digit pincode",
        variant: "destructive",
      });
      return;
    }

    if (!areasInput.trim()) {
      toast({
        title: "Error",
        description: "Please enter at least one area",
        variant: "destructive",
      });
      return;
    }

    const areasArray = areasInput.split(",").map((a) => a.trim()).filter((a) => a);

    setSaving(true);
    try {
      await makeRequest('/service-area/', {
        method: 'POST',
        body: JSON.stringify({
          pincode: pincode.trim(),
          areas: areasArray,
        }),
      });

      toast({
        title: "Success",
        description: "Service area added successfully",
      });

      setIsAddModalOpen(false);
      setPincode('');
      setAreasInput('');
      fetchServiceAreas();
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save service area",
        variant: "destructive",
      });
    } finally {
      setSaving(false);
    }
  };

  const deleteServiceArea = async (id: number) => {
    if (!confirm("Are you sure you want to delete this service area?")) return;

    setDeletingId(id);
    try {
      await makeRequest(`/service-area/${id}`, {
        method: 'DELETE',
      });

      toast({
        title: "Deleted",
        description: "Service area deleted successfully",
      });

      setServiceAreas(serviceAreas.filter((area) => area.id !== id));
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to delete service area",
        variant: "destructive",
      });
    } finally {
      setDeletingId(null);
    }
  };

  const viewDetails = async (serviceArea: ServiceArea) => {
    try {
      const data = await makeRequest(`/service-area/by-pincode?pincode=${serviceArea.pincode}`);
      setSelectedServiceArea(data || serviceArea);
      setIsDetailModalOpen(true);
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to fetch service area details",
        variant: "destructive",
      });
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6 p-4 sm:p-0">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Service Areas</h1>
          <p className="text-gray-600 mt-2">Manage delivery locations by pincode</p>
        </div>
        <Dialog open={isAddModalOpen} onOpenChange={setIsAddModalOpen}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">Add Service Area</Button>
          </DialogTrigger>
          <DialogContent className="mx-4 max-w-md">
            <DialogHeader>
              <DialogTitle>Add Service Area</DialogTitle>
              <DialogDescription>
                Enter a 5-digit pincode and areas to add a new service area
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="pincode">Pincode</Label>
                <Input
                  id="pincode"
                  value={pincode}
                  onChange={(e) => setPincode(e.target.value)}
                  placeholder="Enter 5-digit pincode"
                  maxLength={5}
                  type="number"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="areas">Areas</Label>
                <Input
                  id="areas"
                  value={areasInput}
                  onChange={(e) => setAreasInput(e.target.value)}
                  placeholder="Enter areas separated by commas (e.g. Andheri, Bandra, Juhu)"
                />
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <Button 
                  onClick={saveServiceArea} 
                  disabled={saving || pincode.length !== 5}
                >
                  {saving ? "Saving..." : "Save"}
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setIsAddModalOpen(false)}
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Service Areas</CardTitle>
          <CardDescription>
            {serviceAreas.length} pincode(s) configured
          </CardDescription>
        </CardHeader>
        <CardContent className="p-0 sm:p-6">
          {serviceAreas.length === 0 ? (
            <div className="text-center py-8 px-4">
              <p className="text-gray-500">No service areas configured yet</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="min-w-[100px]">Pincode</TableHead>
                    <TableHead className="min-w-[120px]">Areas Count</TableHead>
                    <TableHead className="min-w-[120px] hidden sm:table-cell">Created At</TableHead>
                    <TableHead className="min-w-[150px]">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {serviceAreas.map((serviceArea) => (
                    <TableRow key={serviceArea.id}>
                      <TableCell className="font-medium">{serviceArea.pincode}</TableCell>
                      <TableCell>{serviceArea.areas.length}</TableCell>
                      <TableCell className="hidden sm:table-cell">
                        {new Date(serviceArea.createdAt).toLocaleDateString()}
                      </TableCell>
                      <TableCell className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => viewDetails(serviceArea)}
                          className="text-xs px-2 py-1"
                        >
                          View
                        </Button>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => deleteServiceArea(serviceArea.id)}
                          className="text-xs px-2 py-1"
                          disabled={deletingId === serviceArea.id}
                        >
                          {deletingId === serviceArea.id ? "Deleting..." : "Delete"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Details Modal */}
      <Dialog open={isDetailModalOpen} onOpenChange={setIsDetailModalOpen}>
        <DialogContent className="mx-4 max-w-lg">
          <DialogHeader>
            <DialogTitle>Service Area Details</DialogTitle>
            <DialogDescription>
              Areas served for pincode {selectedServiceArea?.pincode}
            </DialogDescription>
          </DialogHeader>
          {selectedServiceArea && (
            <div className="space-y-4">
              <div>
                <Label>Pincode</Label>
                <p className="text-lg font-medium">{selectedServiceArea.pincode}</p>
              </div>
              <div>
                <Label>Areas ({selectedServiceArea.areas.length})</Label>
                <div className="mt-2 max-h-64 overflow-y-auto border rounded-md p-3">
                  <ul className="space-y-1">
                    {selectedServiceArea.areas.map((area, index) => (
                      <li key={index} className="text-sm py-1 px-2 bg-gray-50 rounded">
                        {area}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ServiceAreas;
