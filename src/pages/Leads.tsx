import React, { useState } from 'react';
import { Plus, Trash2, UserPlus } from 'lucide-react';
import DataTable from '../components/DataTable';
import ActionButton from '../components/ActionButton';
import Modal from '../components/Modal';
import SearchFilter from '../components/SearchFilter';
import LeadForm from '../components/LeadForm';
import { useData } from '../context/DataContext';
import { useNotification } from '../context/NotificationContext';
import { Lead } from '../types/data';
import StatusBadge from '../components/StatusBadge';

const ITEMS_PER_PAGE = 10;

const Leads: React.FC = () => {
  const { leads, addLead, updateLead, deleteLead, salespeople } = useData();
  const { showNotification } = useNotification();

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [sourceFilter, setSourceFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedLeads, setSelectedLeads] = useState<Set<number | string>>(new Set());

  const filteredLeads = leads.filter(lead => {
    const matchesSearch = searchTerm === '' || 
      lead.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      lead.lastName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === '' || lead.status === statusFilter;
    const matchesSource = sourceFilter === '' || lead.source === sourceFilter;
    
    return matchesSearch && matchesStatus && matchesSource;
  });

  const paginatedLeads = filteredLeads.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE
  );

  const handleAddLead = (lead: Lead) => {
    addLead(lead);
    showNotification('Lead added successfully', 'success');
    setIsAddModalOpen(false);
  };

  const handleUpdateLead = (lead: Lead) => {
    updateLead(lead);
    showNotification('Lead updated successfully', 'success');
    setIsViewModalOpen(false);
  };

  const handleDeleteLead = () => {
    if (selectedLead) {
      deleteLead(selectedLead.id);
      showNotification('Lead deleted successfully', 'success');
      setIsDeleteModalOpen(false);
      setSelectedLead(null);
    }
  };

  const handleBulkDelete = () => {
    selectedLeads.forEach(id => deleteLead(id));
    showNotification(`${selectedLeads.size} leads deleted`, 'success');
    setSelectedLeads(new Set());
  };

  const handleBulkAssign = (salesPersonId: string) => {
    selectedLeads.forEach(id => {
      const lead = leads.find(l => l.id === id);
      if (lead) {
        updateLead({ ...lead, assignedTo: salesPersonId });
      }
    });
    showNotification(`${selectedLeads.size} leads assigned`, 'success');
    setSelectedLeads(new Set());
  };

  const columns = [
    { 
      key: 'domain',
      label: 'Domain',
      sortable: true,
      render: (value: string, item: Lead) => (
        <div>
          <div className="font-medium">{value}</div>
          <div className="text-sm text-gray-500">{item.firstName} {item.lastName}</div>
        </div>
      )
    },
    { key: 'price', label: 'Price', sortable: true, render: (value: number) => `$${value}` },
    { key: 'source', label: 'Source', sortable: true },
    { 
      key: 'status',
      label: 'Status',
      sortable: true,
      render: (value: string) => <StatusBadge status={value} type="lead" />
    },
    { 
      key: 'assignedTo',
      label: 'Assigned To',
      sortable: true,
      render: (value: string) => {
        const person = salespeople?.find(p => p.id.toString() === value);
        return person ? person.name : 'Unassigned';
      }
    },
    {
      key: 'actions',
      label: 'Actions',
      render: (_: any, item: Lead) => (
        <div className="flex justify-end gap-2">
          <ActionButton
            label="Edit"
            variant="primary"
            size="sm"
            onClick={() => {
              setSelectedLead(item);
              setIsViewModalOpen(true);
            }}
          />
          <ActionButton
            label="Delete"
            variant="danger"
            size="sm"
            onClick={() => {
              setSelectedLead(item);
              setIsDeleteModalOpen(true);
            }}
          />
        </div>
      )
    }
  ];

  return (
    <div className="max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
        <h2 className="text-2xl font-semibold text-gray-800">Lead Management</h2>
        <div className="flex gap-2">
          {selectedLeads.size > 0 && (
            <>
              <ActionButton
                label={`Delete (${selectedLeads.size})`}
                icon={<Trash2 size={18} />}
                onClick={() => setIsDeleteModalOpen(true)}
                variant="danger"
              />
              <ActionButton
                label={`Assign (${selectedLeads.size})`}
                icon={<UserPlus size={18} />}
                onClick={() => {/* Show assign modal */}}
                variant="secondary"
              />
            </>
          )}
          <ActionButton
            label="New Lead"
            icon={<Plus size={18} />}
            onClick={() => setIsAddModalOpen(true)}
            variant="primary"
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6">
        <SearchFilter
          searchPlaceholder="Search leads..."
          onSearch={setSearchTerm}
          filters={[
            {
              label: 'Status',
              value: statusFilter,
              onChange: setStatusFilter,
              options: [
                { value: 'new', label: 'New' },
                { value: 'contacted', label: 'Contacted' },
                { value: 'qualified', label: 'Qualified' },
                { value: 'converted', label: 'Converted' },
                { value: 'lost', label: 'Lost' }
              ]
            },
            {
              label: 'Source',
              value: sourceFilter,
              onChange: setSourceFilter,
              options: [
                { value: 'website', label: 'Website' },
                { value: 'referral', label: 'Referral' },
                { value: 'call', label: 'Call' },
                { value: 'other', label: 'Other' }
              ]
            }
          ]}
        />
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <DataTable
          columns={columns}
          data={paginatedLeads}
          pageSize={ITEMS_PER_PAGE}
          selectable={true}
          onSelectionChange={(ids) => setSelectedLeads(new Set(ids))}
          statusType="lead"
        />
        
        <div className="px-6 py-4 border-t border-gray-200 flex justify-between items-center">
          <div className="text-sm text-gray-500">
            Showing {(currentPage - 1) * ITEMS_PER_PAGE + 1} to {Math.min(currentPage * ITEMS_PER_PAGE, filteredLeads.length)} of {filteredLeads.length} leads
          </div>
          <div className="flex gap-2">
            <ActionButton
              label="Previous"
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              variant="secondary"
              disabled={currentPage === 1}
            />
            <ActionButton
              label="Next"
              onClick={() => setCurrentPage(p => p + 1)}
              variant="secondary"
              disabled={currentPage * ITEMS_PER_PAGE >= filteredLeads.length}
            />
          </div>
        </div>
      </div>

      <Modal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        title="Add New Lead"
      >
        <LeadForm onSave={handleAddLead} onCancel={() => setIsAddModalOpen(false)} />
      </Modal>

      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Edit Lead"
      >
        {selectedLead && (
          <LeadForm
            initialData={selectedLead}
            onSave={handleUpdateLead}
            onCancel={() => setIsViewModalOpen(false)}
          />
        )}
      </Modal>

      <Modal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        title="Confirm Delete"
      >
        <div className="p-6">
          <p className="mb-4">Are you sure you want to delete {selectedLeads.size > 0 ? `${selectedLeads.size} leads` : 'this lead'}?</p>
          <div className="flex justify-end gap-2">
            <ActionButton
              label="Cancel"
              onClick={() => setIsDeleteModalOpen(false)}
              variant="secondary"
            />
            <ActionButton
              label="Delete"
              onClick={selectedLeads.size > 0 ? handleBulkDelete : handleDeleteLead}
              variant="danger"
            />
          </div>
        </div>
      </Modal>
    </div>
  );
};

export default Leads;