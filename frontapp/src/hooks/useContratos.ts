import { useState, useEffect, useCallback, useMemo } from 'react';
import { Contract, ContractFilters, ContractKPI, ContractStatus } from '@/lib/types/admin/contracts';
import { MOCK_CONTRACTS_DATA } from '@/lib/mocks/contractsData';

export const useContratos = () => {
    const [contracts, setContracts] = useState<Contract[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [selectedContract, setSelectedContract] = useState<Contract | null>(null);

    const [filters, setFilters] = useState<ContractFilters>({
        query: '',
        modality: 'ALL',
        status: 'ALL',
        dateType: 'SIGNATURE',
        dateLimit: ''
    });

    const fetchContracts = useCallback(async () => {
        setLoading(true);
        try {
            await new Promise(resolve => setTimeout(resolve, 600));
            setContracts(prev => 
                prev.length === 0 ? [...MOCK_CONTRACTS_DATA] : prev
            );
            setError(null);
        } catch (err: any) {
            setError(err.message || 'Error al obtener contratos.');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(() => {
        if (contracts.length === 0) {
            fetchContracts();
        }
    }, [fetchContracts]);

    const filteredContracts = useMemo(() => {
        const now = new Date();
        const fifteenDaysFromNow = new Date();
        fifteenDaysFromNow.setDate(now.getDate() + 15);

        return contracts.map(c => {
            let urgency: 'normal' | 'warning' | 'critical' = 'normal';
            if (c.end) {
                const expiryDate = new Date(c.end);
                if (expiryDate < now) urgency = 'critical';
                else if (expiryDate <= fifteenDaysFromNow) urgency = 'warning';
            }
            return { ...c, expiryUrgency: urgency };
        }).filter(c => {
            const matchQuery = !filters.query ||
                c.company.toLowerCase().includes(filters.query.toLowerCase()) ||
                c.ruc.includes(filters.query) ||
                c.id.toLowerCase().includes(filters.query.toLowerCase());

            const matchStatus = filters.status === 'ALL' || c.status === filters.status;
            const matchModality = filters.modality === 'ALL' || c.modality === filters.modality;

            let matchDate = true;
            if (filters.dateLimit) {
                const targetDate = filters.dateType === 'SIGNATURE' ? c.start : c.end;
                matchDate = targetDate <= filters.dateLimit;
            }

            return matchQuery && matchStatus && matchModality && matchDate;
        });
    }, [contracts, filters]);

    const kpis = useMemo((): ContractKPI[] => {
        return [
            { label: 'Total Contratos', val: contracts.length, color: 'indigo', icon: 'Files' },
            { label: 'Vigentes (Activos)', val: contracts.filter(c => c.status === 'ACTIVE').length, color: 'emerald', icon: 'CheckCircle' },
            { label: 'Por Validar', val: contracts.filter(c => c.status === 'PENDING').length, color: 'amber', icon: 'Hourglass' },
            { label: 'Vencidos / Exp.', val: contracts.filter(c => c.status === 'EXPIRED').length, color: 'red', icon: 'AlertOctagon' }
        ];
    }, [contracts]);

    const validateContract = async (id: string, updatedInfo: Partial<Contract>) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = contracts.findIndex(c => c.id === id);
            if (index !== -1) {
                const newContracts = [...contracts];
                newContracts[index] = {
                    ...newContracts[index],
                    ...updatedInfo,
                    status: 'ACTIVE',
                    auditTrail: [
                        ...(newContracts[index].auditTrail || []),
                        { timestamp: new Date().toISOString(), action: 'Estado actualizado a ACTIVE', user: 'Admin (System)' }
                    ]
                };
                setContracts(newContracts);
            }
            setSelectedContract(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const invalidateContract = async (id: string, updatedInfo: Partial<Contract>) => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));

            const index = contracts.findIndex(c => c.id === id);
            if (index !== -1) {
                const newContracts = [...contracts];
                newContracts[index] = {
                    ...newContracts[index],
                    ...updatedInfo,
                    status: 'EXPIRED',
                    auditTrail: [
                        ...(newContracts[index].auditTrail || []),
                        { timestamp: new Date().toISOString(), action: 'Estado actualizado a EXPIRED', user: 'Admin (System)' }
                    ]
                };
                setContracts(newContracts);
            }
            setSelectedContract(null);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const createNew = async () => {
        try {
            setLoading(true);
            await new Promise(resolve => setTimeout(resolve, 500));

            const nextId = `CTR-${new Date().getFullYear()}-${Math.floor(Math.random() * 900 + 100)}`;
            const newContract: Contract = {
                id: nextId,
                company: 'Nueva Empresa TEMP',
                ruc: '',
                rep: '',
                type: 'Comisión Mercantil',
                modality: 'VIRTUAL',
                status: 'PENDING',
                start: new Date().toISOString().split('T')[0],
                end: '',
                storage_path: 'No cargado aún',
                auditTrail: [
                    { timestamp: new Date().toISOString(), action: 'Contrato Borrador Creado', user: 'Admin' }
                ]
            };

            setContracts([newContract, ...contracts]);
            setSelectedContract(newContract);
        } catch (err: any) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    const openTemplates = () => {
        console.log('[Contracts] Abriendo repositorio de plantillas legas');
        window.open('https://docs.google.com/viewer?url=https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf', '_blank');
    };

    return {
        state: {
            contracts: filteredContracts,
            kpis,
            loading,
            error,
            filters,
            selectedContract
        },
        actions: {
            setFilters,
            setSelectedContract,
            validateContract,
            invalidateContract,
            createNew,
            fetchContracts,
            openTemplates
        }
    };
};
