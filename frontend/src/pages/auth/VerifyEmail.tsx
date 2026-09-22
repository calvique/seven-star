import React,{useEffect,useState} from 'react';
import { Helmet } from 'react-helmet-async';
import { Link,useParams } from 'react-router-dom';
import { Spinner } from '../../components/ui';
import { useAuth } from '../../context/AuthContext';
import { useSettings } from '../../context/SettingsContext';
export function VerifyEmail(){const {verifyEmail}=useAuth();const {getSettingValue}=useSettings();const schoolName=getSettingValue('general','school.name','Seven Star English Boarding School');const {token=''}=useParams();const[state,setState]=useState<'loading'|'done'|'error'>('loading');useEffect(()=>{verifyEmail(token).then(()=>setState('done')).catch(()=>setState('error'))},[token]);return <><Helmet><title>Verify Email | {schoolName}</title></Helmet><div className="text-center"><h2 className="font-heading text-2xl font-bold">Email verification</h2>{state==='loading'&&<div className="py-8"><Spinner size="lg"/></div>}{state==='done'&&<><p className="text-green-700 mt-4">Your email has been verified.</p><Link to="/login" className="inline-block mt-5 text-primary-600 hover:underline">Continue to login</Link></>}{state==='error'&&<p className="text-red-700 mt-4">This verification link is invalid or expired.</p>}</div></>}
