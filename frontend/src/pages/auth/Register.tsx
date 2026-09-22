import React, { useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { Link, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { Button, Input, Select } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';

export function Register() {
  const { register } = useAuth(); const { getSettingValue } = useSettings(); const navigate = useNavigate();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [form, setForm] = useState({ name:'', email:'', phone:'', password:'', confirm:'', role:'student' }); const [error,setError]=useState(''); const [loading,setLoading]=useState(false); const [message,setMessage]=useState('');
  const submit = async (e: React.FormEvent) => { e.preventDefault(); setError(''); if(form.password!==form.confirm){setError('Passwords do not match.');return;} setLoading(true); try { await register({name:form.name,email:form.email,phone:form.phone,password:form.password,role:form.role}); if(form.role==='teacher'){setMessage('Teacher signup submitted. An administrator must approve your teacher account before you can log in.');} else navigate('/dashboard'); } catch(err:any){setError(err?.response?.data?.message||err?.message||'Registration failed.');} finally{setLoading(false);} };
  return <><Helmet><title>Register | {schoolName}</title></Helmet><div><h2 className="font-heading text-2xl font-bold">Create account</h2><p className="text-gray-500 mt-1">Student, parent and teacher registration.</p>{error&&<div className="mt-4 p-3 bg-red-50 text-red-700 rounded-lg text-sm">{error}</div>}{message&&<div className="mt-4 p-3 bg-blue-50 text-blue-700 rounded-lg text-sm">{message}</div>} {!message && <form onSubmit={submit} className="mt-6 space-y-4"><Input label="Full name" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required/><Input label="Email" type="email" value={form.email} onChange={e=>setForm({...form,email:e.target.value})} required/><Input label="Phone" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})}/><Select label="Account type" value={form.role} onChange={e=>setForm({...form,role:e.target.value})} options={[{value:'student',label:'Student'},{value:'parent',label:'Parent'},{value:'teacher',label:'Teacher'}]}/><Input label="Password" type="password" value={form.password} onChange={e=>setForm({...form,password:e.target.value})} required minLength={8}/><Input label="Confirm password" type="password" value={form.confirm} onChange={e=>setForm({...form,confirm:e.target.value})} required minLength={8}/><Button type="submit" loading={loading} className="w-full"><UserPlus className="w-4 h-4 mr-2"/> Create account</Button></form>}<p className="text-sm text-center mt-5">Already have an account? <Link to="/login" className="text-primary-600 hover:underline">Sign in</Link></p></div></>;
}
