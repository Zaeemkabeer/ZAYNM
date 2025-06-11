import React, { createContext, useContext, useState } from 'react';
import { format, subDays, addDays } from 'date-fns';
import { Lead, User } from '../types/data';

interface DataContextType {
  leads: Lead[];
  managementUsers: User[];
  salespeople: User[];
  addLead: (lead: Omit<Lead, 'id'>) => void;
  updateLead: (lead: Lead) => void;
  deleteLead: (id: number) => void;
  filterLeads: (searchTerm: string, status: string) => Lead[];
}

const currentDate = new Date().toISOString();

const initialLeads: Lead[] = [
  { 
    id: 1, 
    domain: 'techstartup.com', 
    price: 4500, 
    clicks: 3330, 
    update: format(new Date(), 'MMM dd'), 
    status: 'new',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@techstartup.com',
    phone: '+1 (555) 123-4567',
    source: 'website',
    notes: 'Interested in premium domain for tech startup. Budget up to $5000. Very responsive to emails.',
    createdAt: format(new Date(), 'yyyy-MM-dd'),
    assignedTo: '5'
  },
  { 
    id: 2, 
    domain: 'ecommerce-pro.com', 
    price: 7200, 
    clicks: 2890, 
    update: format(subDays(new Date(), 1), 'MMM dd'), 
    status: 'contacted',
    firstName: 'Jane',
    lastName: 'Smith',
    email: 'jane@ecommerce-pro.com',
    phone: '+1 (555) 234-5678',
    source: 'referral',
    notes: 'E-commerce business owner looking for brandable domain. Very responsive. Scheduled follow-up call.',
    createdAt: format(subDays(new Date(), 1), 'yyyy-MM-dd'),
    assignedTo: '5'
  },
  { 
    id: 3, 
    domain: 'fintech-solutions.com', 
    price: 12500, 
    clicks: 4120, 
    update: format(subDays(new Date(), 2), 'MMM dd'), 
    status: 'qualified',
    firstName: 'Michael',
    lastName: 'Johnson',
    email: 'mike@fintech-solutions.com',
    phone: '+1 (555) 345-6789',
    source: 'call',
    notes: 'Fintech startup with Series A funding. High-value prospect. Decision maker confirmed.',
    createdAt: format(subDays(new Date(), 2), 'yyyy-MM-dd'),
    assignedTo: '5'
  },
  { 
    id: 4, 
    domain: 'healthtech-app.com', 
    price: 8900, 
    clicks: 1560, 
    update: format(subDays(new Date(), 3), 'MMM dd'), 
    status: 'converted',
    firstName: 'Sarah',
    lastName: 'Wilson',
    email: 'sarah@healthtech-app.com',
    phone: '+1 (555) 456-7890',
    source: 'website',
    notes: 'Successfully converted! Health app startup, paid full amount. Excellent customer experience.',
    createdAt: format(subDays(new Date(), 3), 'yyyy-MM-dd'),
    assignedTo: '5'
  },
  { 
    id: 5, 
    domain: 'crypto-exchange.com', 
    price: 25000, 
    clicks: 5670, 
    update: format(subDays(new Date(), 4), 'MMM dd'), 
    status: 'lost',
    firstName: 'David',
    lastName: 'Brown',
    email: 'david@crypto-exchange.com',
    phone: '+1 (555) 567-8901',
    source: 'referral',
    notes: 'Price too high for their budget. Went with competitor. Maintain relationship for future opportunities.',
    createdAt: format(subDays(new Date(), 4), 'yyyy-MM-dd'),
    assignedTo: '5'
  },
  { 
    id: 6, 
    domain: 'ai-consulting.com', 
    price: 15000, 
    clicks: 3890, 
    update: format(subDays(new Date(), 5), 'MMM dd'), 
    status: 'new',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily@ai-consulting.com',
    phone: '+1 (555) 678-9012',
    source: 'website',
    notes: 'AI consulting firm, very interested in premium domain. Initial contact made.',
    createdAt: format(subDays(new Date(), 5), 'yyyy-MM-dd'),
    assignedTo: '6'
  },
  { 
    id: 7, 
    domain: 'green-energy.com', 
    price: 18500, 
    clicks: 4230, 
    update: format(subDays(new Date(), 6), 'MMM dd'), 
    status: 'contacted',
    firstName: 'Robert',
    lastName: 'Miller',
    email: 'robert@green-energy.com',
    phone: '+1 (555) 789-0123',
    source: 'call',
    notes: 'Renewable energy company. Scheduled follow-up call. Strong interest shown.',
    createdAt: format(subDays(new Date(), 6), 'yyyy-MM-dd'),
    assignedTo: '6'
  },
  { 
    id: 8, 
    domain: 'fooddelivery-app.com', 
    price: 9800, 
    clicks: 2340, 
    update: format(subDays(new Date(), 7), 'MMM dd'), 
    status: 'qualified',
    firstName: 'Lisa',
    lastName: 'Anderson',
    email: 'lisa@fooddelivery-app.com',
    phone: '+1 (555) 890-1234',
    source: 'website',
    notes: 'Food delivery startup. Ready to move forward with purchase. Budget approved.',
    createdAt: format(subDays(new Date(), 7), 'yyyy-MM-dd'),
    assignedTo: '6'
  },
  { 
    id: 9, 
    domain: 'blockchain-dev.com', 
    price: 22000, 
    clicks: 5120, 
    update: format(subDays(new Date(), 8), 'MMM dd'), 
    status: 'converted',
    firstName: 'James',
    lastName: 'Taylor',
    email: 'james@blockchain-dev.com',
    phone: '+1 (555) 901-2345',
    source: 'referral',
    notes: 'Blockchain development company. Successful sale! Excellent communication throughout process.',
    createdAt: format(subDays(new Date(), 8), 'yyyy-MM-dd'),
    assignedTo: '6'
  },
  { 
    id: 10, 
    domain: 'edtech-platform.com', 
    price: 11200, 
    clicks: 3450, 
    update: format(subDays(new Date(), 9), 'MMM dd'), 
    status: 'new',
    firstName: 'Amanda',
    lastName: 'White',
    email: 'amanda@edtech-platform.com',
    phone: '+1 (555) 012-3456',
    source: 'website',
    notes: 'Educational technology platform. Initial inquiry received. High potential.',
    createdAt: format(subDays(new Date(), 9), 'yyyy-MM-dd'),
    assignedTo: '5'
  },
  { 
    id: 11, 
    domain: 'travel-booking.com', 
    price: 16800, 
    clicks: 4890, 
    update: format(subDays(new Date(), 10), 'MMM dd'), 
    status: 'contacted',
    firstName: 'Christopher',
    lastName: 'Garcia',
    email: 'chris@travel-booking.com',
    phone: '+1 (555) 123-4567',
    source: 'call',
    notes: 'Travel booking platform. Sent detailed proposal. Awaiting response.',
    createdAt: format(subDays(new Date(), 10), 'yyyy-MM-dd'),
    assignedTo: '5'
  },
  { 
    id: 12, 
    domain: 'fitness-tracker.com', 
    price: 7500, 
    clicks: 2180, 
    update: format(subDays(new Date(), 11), 'MMM dd'), 
    status: 'qualified',
    firstName: 'Michelle',
    lastName: 'Rodriguez',
    email: 'michelle@fitness-tracker.com',
    phone: '+1 (555) 234-5678',
    source: 'website',
    notes: 'Fitness app startup. Budget approved, ready to purchase. Excellent prospect.',
    createdAt: format(subDays(new Date(), 11), 'yyyy-MM-dd'),
    assignedTo: '6'
  },
  { 
    id: 13, 
    domain: 'smart-home.com', 
    price: 13500, 
    clicks: 3780, 
    update: format(subDays(new Date(), 12), 'MMM dd'), 
    status: 'new',
    firstName: 'Kevin',
    lastName: 'Lee',
    email: 'kevin@smart-home.com',
    phone: '+1 (555) 345-6789',
    source: 'referral',
    notes: 'Smart home technology company. Initial contact established.',
    createdAt: format(subDays(new Date(), 12), 'yyyy-MM-dd'),
    assignedTo: '5'
  },
  { 
    id: 14, 
    domain: 'digital-marketing.com', 
    price: 9200, 
    clicks: 2650, 
    update: format(subDays(new Date(), 13), 'MMM dd'), 
    status: 'contacted',
    firstName: 'Rachel',
    lastName: 'Thompson',
    email: 'rachel@digital-marketing.com',
    phone: '+1 (555) 456-7890',
    source: 'website',
    notes: 'Digital marketing agency. Follow-up scheduled for next week.',
    createdAt: format(subDays(new Date(), 13), 'yyyy-MM-dd'),
    assignedTo: '6'
  },
  { 
    id: 15, 
    domain: 'cloud-storage.com', 
    price: 19500, 
    clicks: 5240, 
    update: format(subDays(new Date(), 14), 'MMM dd'), 
    status: 'qualified',
    firstName: 'Daniel',
    lastName: 'Martinez',
    email: 'daniel@cloud-storage.com',
    phone: '+1 (555) 567-8901',
    source: 'call',
    notes: 'Cloud storage startup. Technical requirements discussed. Moving to contract phase.',
    createdAt: format(subDays(new Date(), 14), 'yyyy-MM-dd'),
    assignedTo: '5'
  }
];

const initialManagementUsers: User[] = [
  { 
    id: 1, 
    name: 'Admin User', 
    email: 'admin@lead.com', 
    role: 'admin', 
    status: 'active', 
    lastLogin: format(new Date(), 'MMM dd, yyyy')
  },
  { 
    id: 2, 
    name: 'Jane Manager', 
    email: 'jane@lead.com', 
    role: 'manager', 
    status: 'active', 
    lastLogin: format(subDays(new Date(), 1), 'MMM dd, yyyy')
  },
  { 
    id: 3, 
    name: 'Bob Supervisor', 
    email: 'bob@lead.com', 
    role: 'manager', 
    status: 'inactive', 
    lastLogin: format(subDays(new Date(), 15), 'MMM dd, yyyy')
  },
  { 
    id: 4, 
    name: 'Lisa Agent', 
    email: 'lisa@lead.com', 
    role: 'user', 
    status: 'active', 
    lastLogin: format(subDays(new Date(), 2), 'MMM dd, yyyy')
  }
];

const initialSalespeople: User[] = [
  {
    id: 5,
    name: 'Alex Sales',
    email: 'alex@lead.com',
    role: 'user',
    status: 'active',
    lastLogin: format(new Date(), 'MMM dd, yyyy'),
    performance: {
      leadsConverted: 28,
      conversionRate: 82
    }
  },
  {
    id: 6,
    name: 'Maria Rodriguez',
    email: 'maria@lead.com',
    role: 'user',
    status: 'active',
    lastLogin: format(subDays(new Date(), 1), 'MMM dd, yyyy'),
    performance: {
      leadsConverted: 35,
      conversionRate: 88
    }
  },
  {
    id: 7,
    name: 'Tom Wilson',
    email: 'tom@lead.com',
    role: 'user',
    status: 'active',
    lastLogin: format(subDays(new Date(), 2), 'MMM dd, yyyy'),
    performance: {
      leadsConverted: 22,
      conversionRate: 75
    }
  },
  {
    id: 8,
    name: 'Sarah Johnson',
    email: 'sarah.j@lead.com',
    role: 'user',
    status: 'active',
    lastLogin: format(subDays(new Date(), 1), 'MMM dd, yyyy'),
    performance: {
      leadsConverted: 31,
      conversionRate: 85
    }
  }
];

export const DataContext = createContext<DataContextType>({
  leads: [],
  managementUsers: [],
  salespeople: [],
  addLead: () => {},
  updateLead: () => {},
  deleteLead: () => {},
  filterLeads: () => []
});

export const useData = () => useContext(DataContext);

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [leads, setLeads] = useState<Lead[]>(initialLeads);
  const [managementUsers] = useState(initialManagementUsers);
  const [salespeople] = useState(initialSalespeople);

  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead: Lead = {
      ...lead,
      id: leads.length + 1,
      createdAt: new Date().toISOString()
    };
    setLeads([...leads, newLead]);
  };

  const updateLead = (updatedLead: Lead) => {
    setLeads(leads.map(lead => 
      lead.id === updatedLead.id ? updatedLead : lead
    ));
  };

  const deleteLead = (id: number) => {
    setLeads(leads.filter(lead => lead.id !== id));
  };

  const filterLeads = (searchTerm: string, status: string): Lead[] => {
    return leads.filter(lead => {
      const matchesSearch = searchTerm === '' || 
        lead.domain.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = status === '' || lead.status === status;
      
      return matchesSearch && matchesStatus;
    });
  };

  return (
    <DataContext.Provider value={{ 
      leads, 
      managementUsers,
      salespeople,
      addLead,
      updateLead,
      deleteLead,
      filterLeads
    }}>
      {children}
    </DataContext.Provider>
  );
};