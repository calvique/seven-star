import React, { FormEvent, useState } from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertCircle, Download, Printer, Search, Trophy } from 'lucide-react';
import { Badge, Button, Card, Input } from '../../components/ui';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

type SearchResult = { student: { name: string; admissionNumber?: string; rollNumber?: string; class?: any }; results: any[] };

export function ResultSearch() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [rollNumber, setRollNumber] = useState('');
  const [symbolNumber, setSymbolNumber] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [examId, setExamId] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const search = async (event: FormEvent) => {
    event.preventDefault();
    setError(''); setResult(null);
    if (!rollNumber.trim() && !symbolNumber.trim()) { setError('Enter a roll number or symbol/admission number.'); return; }
    setLoading(true);
    try {
      const response: any = await api.searchResultByRoll({ rollNumber: rollNumber.trim() || undefined, symbolNumber: symbolNumber.trim() || undefined, academicYear: academicYear.trim() || undefined, examId: examId.trim() || undefined });
      setResult(response.data?.data ?? response.data ?? null);
    } catch (err: any) {
      setError(err?.response?.data?.message || 'No published result was found.');
    } finally { setLoading(false); }
  };

  return <>
    <Helmet><title>Class 11 & 12 Results | {schoolName}</title><meta name="description" content={`Search published Class 11 and 12 results from ${schoolName}.`} /></Helmet>
    <section className="bg-primary-700 text-white py-16"><div className="container-custom"><Badge variant="secondary" className="mb-4"><Trophy className="w-4 h-4 inline mr-1" /> Results Portal</Badge><h1 className="font-heading text-4xl md:text-5xl font-bold">Class 11 & 12 Results</h1><p className="mt-4 text-primary-100 max-w-2xl">Search published results using your roll number or symbol/admission number.</p></div></section>
    <section className="section bg-gray-50"><div className="container-custom max-w-5xl"><Card><form onSubmit={search} className="grid md:grid-cols-2 gap-5"><Input label="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="Roll number" /><Input label="Symbol / Admission Number" value={symbolNumber} onChange={(e) => setSymbolNumber(e.target.value)} placeholder="Symbol or admission number" /><Input label="Academic Year (optional)" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="e.g. 2083 B.S." /><Input label="Exam ID (optional)" value={examId} onChange={(e) => setExamId(e.target.value)} placeholder="Leave blank for all published exams" /><div className="md:col-span-2 flex flex-wrap gap-3"><Button type="submit" loading={loading}><Search className="w-4 h-4 mr-2" /> Search Result</Button><Button type="button" variant="outline" onClick={() => { setRollNumber(''); setSymbolNumber(''); setAcademicYear(''); setExamId(''); setResult(null); setError(''); }}>Reset</Button></div></form>{error && <div className="mt-5 p-4 rounded-lg bg-red-50 text-red-700 flex gap-3"><AlertCircle className="w-5 h-5" /> {error}</div>}</Card>
      {result && <Card className="mt-8"><div className="flex flex-wrap justify-between gap-4 mb-6"><div><h2 className="font-heading text-2xl font-bold">{result.student?.name}</h2><p className="text-gray-500 mt-1">Admission: {result.student?.admissionNumber || '—'} · Roll: {result.student?.rollNumber || '—'}</p></div><div className="flex gap-2 print:hidden"><Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button><Button onClick={() => window.print()}><Download className="w-4 h-4 mr-2" /> Save PDF</Button></div></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-3">Exam</th><th>Subject</th><th>Marks</th><th>Grade</th><th>Status</th></tr></thead><tbody>{result.results.map((row: any, index) => <tr key={row._id || index} className="border-b"><td className="py-3">{row.exam?.name || '—'}</td><td>{row.subject?.name || '—'}</td><td>{row.marksObtained}/{row.maxMarks}</td><td>{row.grade || '—'}</td><td><Badge variant={row.isPass ? 'success' : 'danger'}>{row.isPass ? 'Pass' : 'Fail'}</Badge></td></tr>)}</tbody></table></div></Card>}
    </div></section>
  </>;
}
