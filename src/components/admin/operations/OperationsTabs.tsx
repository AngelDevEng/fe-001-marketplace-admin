import React from 'react';
import { Provider, ProviderFilters, Expense, Credential, AuditLog } from '@/lib/types/admin/operations';
import { PlusCircle, Search, Edit, Users, Ban, CheckCircle, ShieldCheck, Fingerprint } from 'lucide-react';

export const ProvidersTab: React.FC<{
    providers: Provider[];
    filters: ProviderFilters;
    onFilterChange: (filters: ProviderFilters) => void;
    onNewProvider: () => void;
    onEditProvider: (provider: Provider) => void;
}> = ({ providers, filters, onFilterChange, onNewProvider, onEditProvider }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-800 tracking-tighter">Directorio Especializado</h3>
                <button
                    onClick={onNewProvider}
                    className="px-6 py-3 bg-sky-500 text-white rounded-2xl font-black text-xs uppercase hover:bg-sky-600 transition-all flex items-center gap-2 shadow-xl shadow-gray-200"
                >
                    <PlusCircle className="w-5 h-5" /> Nuevo Proveedor
                </button>
            </div>

            {/* Filtros */}
            <div className="bg-white p-6 rounded-3xl border border-gray-100 shadow-sm">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
                    <div className="md:col-span-2 space-y-2">
                        <label htmlFor="provider-search" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Buscador Inteligente</label>
                        <div className="relative">
                            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
                            <input
                                id="provider-search"
                                type="text"
                                placeholder="Buscar por nombre, RUC o email..."
                                value={filters.query}
                                onChange={(e) => onFilterChange({ ...filters, query: e.target.value })}
                                className="w-full pl-10 pr-4 py-3 bg-gray-50 border-none rounded-2xl text-sm focus:ring-2 focus:ring-blue-500/20"
                            />
                        </div>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="provider-type" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Perfil Profesional</label>
                        <select
                            id="provider-type"
                            value={filters.type}
                            onChange={(e) => onFilterChange({ ...filters, type: e.target.value as any })}
                            className="w-full p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-700 cursor-pointer"
                        >
                            <option value="ALL">Todas las especialidades</option>
                            <option value="Economista">Economista</option>
                            <option value="Contador">Contador</option>
                            <option value="Ingeniero">Ingeniero</option>
                        </select>
                    </div>
                    <div className="space-y-2">
                        <label htmlFor="provider-status" className="text-[10px] font-black text-gray-400 uppercase tracking-widest ml-1">Estado Vínculo</label>
                        <select
                            id="provider-status"
                            value={filters.status}
                            onChange={(e) => onFilterChange({ ...filters, status: e.target.value as any })}
                            className="w-full p-3 bg-gray-50 border-none rounded-2xl text-xs font-bold text-gray-700 cursor-pointer"
                        >
                            <option value="ALL">Todos</option>
                            <option value="Activo">Activo</option>
                            <option value="Suspendido">En Pausa / Suspendido</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Tabla Proveedores */}
            <div className="bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest">
                                <th className="px-6 py-5">Proveedor / Especialidad</th>
                                <th className="px-6 py-5">RUC / DNI</th>
                                <th className="px-6 py-5">Renovación</th>
                                <th className="px-6 py-5">Estado</th>
                                <th className="px-6 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50 uppercase text-[10px] font-bold">
                            {providers.map(p => (
                                <tr key={p.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center font-black">
                                                {p.nombre[0]}
                                            </div>
                                            <div>
                                                <p className="text-xs font-black text-gray-800 tracking-tight leading-none mb-1">{p.nombre}</p>
                                                <p className="text-[9px] text-indigo-500 uppercase">{p.especialidad}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-gray-500">{p.ruc}</td>
                                    <td className="px-6 py-5 text-gray-500 font-medium">{p.fecha_renovacion}</td>
                                    <td className="px-6 py-5">
                                        <span className={`px-3 py-1 ${p.estado === 'Activo' ? 'bg-emerald-50 text-emerald-600' : 'bg-rose-50 text-rose-600'} rounded-lg border border-black/5`}>
                                            {p.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <button
                                            onClick={() => onEditProvider(p)}
                                            className="p-2 text-gray-300 hover:text-gray-900 transition-all font-industrial"
                                        >
                                            <Edit className="w-5 h-5" />
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const ExpensesTab: React.FC<{ expenses: Expense[]; totalInvestment: number; }> = ({ expenses, totalInvestment }) => {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            <div className="lg:col-span-1 bg-white p-6 h-fit space-y-6 rounded-3xl border border-gray-100 shadow-sm">
                <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight font-industrial">Filtros de Gasto</h4>
                <div className="pt-6 border-t border-gray-100 space-y-4">
                    <div>
                        <p className="text-[10px] font-black text-gray-400 uppercase mb-2 font-industrial">Cálculo de Inversión (RF-13)</p>
                        <p className="text-3xl font-black text-gray-900 tracking-tighter font-industrial">S/ {totalInvestment.toLocaleString()}</p>
                    </div>
                </div>
            </div>

            <div className="lg:col-span-3 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight font-industrial">Registro de Recibos y Comprobantes</h4>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[10px] font-black text-gray-400 uppercase tracking-widest font-industrial">
                                <th className="px-6 py-4">ID Recibo</th>
                                <th className="px-6 py-4">Proveedor</th>
                                <th className="px-6 py-4">Concepto</th>
                                <th className="px-6 py-4">Monto</th>
                                <th className="px-6 py-4">Estatus</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {expenses.map(g => (
                                <tr key={g.id} className="hover:bg-gray-50/50 transition-colors uppercase text-[10px] font-bold font-industrial">
                                    <td className="px-6 py-4 text-gray-400">{g.id}</td>
                                    <td className="px-6 py-4">
                                        <p className="text-gray-900">{g.proveedor_nombre}</p>
                                        <p className="text-[9px] text-indigo-500">{g.categoria}</p>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{g.concepto}</td>
                                    <td className="px-6 py-4 font-black text-gray-900">S/ {g.monto.toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2 py-1 ${g.estado === 'Pagado' ? 'bg-emerald-50 text-emerald-600' : 'bg-amber-50 text-amber-600'} rounded-md`}>
                                            {g.estado}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export const CredentialsTab: React.FC<{
    credentials: Credential[];
    onNewRole: () => void;
    onEditRole: (role: string) => void;
    onDeactivateRole: (role: string) => void;
}> = ({ credentials, onNewRole, onEditRole, onDeactivateRole }) => {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h3 className="text-xl font-black text-gray-800 tracking-tighter">Gestión de Roles y Permisos</h3>
                <button
                    onClick={onNewRole}
                    className="px-6 py-3 bg-sky-500 text-white rounded-2xl font-black text-xs uppercase hover:bg-sky-600 transition-all flex items-center gap-2 shadow-xl shadow-gray-200"
                >
                    <PlusCircle className="w-5 h-5" /> Nuevo Rol
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-white rounded-3xl border border-gray-100 shadow-sm overflow-hidden">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-gray-50/50 border-b border-gray-100 text-[9px] font-black text-gray-400 uppercase tracking-widest font-industrial">
                                <th className="px-6 py-5">Rol Operativo</th>
                                <th className="px-6 py-5">Módulos Asignados</th>
                                <th className="px-6 py-5">Usuarios</th>
                                <th className="px-6 py-5 text-center">Estado</th>
                                <th className="px-6 py-5 text-right">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {credentials.map(cred => (
                                <tr key={cred.id} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 bg-purple-50 text-purple-600 rounded-xl flex items-center justify-center font-black text-xs font-industrial">
                                                {cred.rol.substring(0, 2).toUpperCase()}
                                            </div>
                                            <p className="text-xs font-black text-gray-800 uppercase tracking-tight font-industrial">{cred.rol}</p>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex flex-wrap gap-2">
                                            {cred.modulos.map((mod: string) => (
                                                <span key={mod} className="px-2 py-1 bg-indigo-50 text-indigo-600 text-[9px] font-bold rounded-md border border-indigo-100 font-industrial uppercase">
                                                    {mod}
                                                </span>
                                            ))}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2">
                                            <Users className="w-4 h-4 text-gray-400" />
                                            <span className="text-xs font-black text-gray-700 font-industrial">{cred.usuarios_asignados}</span>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5 text-center">
                                        <span className="px-3 py-1 bg-emerald-50 text-emerald-600 text-[9px] font-bold rounded-lg border border-emerald-100 font-industrial uppercase">
                                            {cred.estado}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5 text-right">
                                        <div className="flex items-center justify-end gap-2">
                                            <button
                                                onClick={() => onEditRole(cred.rol)}
                                                className="p-2 text-gray-300 hover:text-indigo-600 transition-all font-industrial"
                                                title="Editar permisos"
                                            >
                                                <Edit className="w-5 h-5" />
                                            </button>
                                            <button
                                                onClick={() => onDeactivateRole(cred.rol)}
                                                className="p-2 text-gray-300 hover:text-rose-600 transition-all font-industrial"
                                                title="Desactivar rol"
                                            >
                                                <Ban className="w-5 h-5" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                <div className="bg-gradient-to-br from-purple-50 to-indigo-50 p-6 h-fit rounded-3xl border border-purple-100 shadow-sm">
                    <div className="w-12 h-12 bg-purple-600 text-white rounded-2xl flex items-center justify-center mb-4">
                        <ShieldCheck className="w-6 h-6" />
                    </div>
                    <h4 className="text-xs font-black text-gray-800 uppercase tracking-tight mb-3 font-industrial">Editor de Permisos</h4>
                    <p className="text-[10px] text-gray-600 leading-relaxed mb-4 font-industrial">
                        Gestione roles operativos y sus permisos de acceso a módulos del sistema. Todas las modificaciones requieren verificación 2FA.
                    </p>
                    <div className="space-y-2 pt-4 border-t border-purple-200">
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-industrial uppercase">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Control granular de accesos</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-industrial uppercase">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Auditoría automática de cambios</span>
                        </div>
                        <div className="flex items-center gap-2 text-[9px] text-gray-500 font-industrial uppercase">
                            <CheckCircle className="w-4 h-4 text-emerald-500" />
                            <span>Seguridad con 2FA</span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export const AuditTab: React.FC<{ logs: AuditLog[]; }> = ({ logs }) => {
    return (
        <div className="bg-white p-0 overflow-hidden rounded-3xl border border-gray-100 shadow-sm">
            <div className="p-6 bg-sky-500 text-white">
                <h3 className="font-black tracking-tight font-industrial uppercase">Log Avanzado de Ingeniería Senior</h3>
                <p className="text-[10px] text-sky-200 uppercase font-bold tracking-widest mt-1 font-industrial">Cumplimiento Estándar de Auditoría (RF-13)</p>
            </div>
            <div className="p-6 space-y-4 max-h-[600px] overflow-y-auto custom-scrollbar">
                {logs.map((log) => (
                    <div key={log.timestamp + log.action} className="flex items-start gap-4 p-4 bg-white rounded-2xl border border-gray-100 shadow-sm">
                        <div className="w-10 h-10 bg-sky-500 text-white rounded-xl flex items-center justify-center flex-shrink-0">
                            <Fingerprint className="w-6 h-6" />
                        </div>
                        <div className="flex-1">
                            <div className="flex justify-between items-center mb-1">
                                <p className="text-xs font-black text-gray-900 uppercase tracking-tighter font-industrial">{log.action} <span className="text-gray-300 mx-2">●</span> {log.user}</p>
                                <span className="text-[9px] font-bold text-gray-400 font-industrial">{log.timestamp}</span>
                            </div>
                            <p className="text-[10px] text-gray-500 font-medium leading-relaxed font-industrial">Entidad: <span className="text-gray-900 font-bold">{log.entity}</span>. <br /> Motivación: {log.reason}</p>
                        </div>
                        {log.action.includes('SUCCESS') && <CheckCircle className="w-6 h-6 text-emerald-500" />}
                    </div>
                ))}
            </div>
        </div>
    );
};
