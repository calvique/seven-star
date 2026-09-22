import React, { FormEvent, useEffect, useState } from 'react';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { Search, Printer, Download, AlertCircle, Trophy } from 'lucide-react';
import { Badge, Button, Card, Input, Select, Spinner } from '../../components/ui';
import { api } from '../../services/api';
import { useSettings } from '../../context/SettingsContext';

type SearchResult = {
  student: { name: string; admissionNumber?: string; symbolNumber?: string; rollNumber?: string; class?: { name?: string } };
  results: any[];
};

type Option = { _id: string; name: string; academicYear?: string; type?: string };

export function ResultSearch() {
  const { getSettingValue } = useSettings();
  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const [classes, setClasses] = useState<Option[]>([]);
  const [exams, setExams] = useState<Option[]>([]);
  const [rollNumber, setRollNumber] = useState('');
  const [symbolNumber, setSymbolNumber] = useState('');
  const [academicYear, setAcademicYear] = useState('');
  const [classId, setClassId] = useState('');
  const [examId, setExamId] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [metaLoading, setMetaLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    (async () => {
      try {
        const [classResponse, examResponse] = await Promise.all([api.get('/classes/by-level'), api.get('/exams/schedule')]);
        setClasses(classResponse.data?.classes ?? classResponse.data?.data?.classes ?? []);
        setExams(examResponse.data?.exams ?? examResponse.data?.data?.exams ?? []);
      } catch (e) { console.error(e); }
      finally { setMetaLoading(false); }
    })();
  }, []);

  const search = async (event: FormEvent) => {
    event.preventDefault(); setError(''); setResult(null);
    if (!rollNumber.trim() && !symbolNumber.trim()) { setError('Enter either a roll number or symbol number.'); return; }
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (rollNumber.trim()) params.set('rollNumber', rollNumber.trim());
      if (symbolNumber.trim()) params.set('symbolNumber', symbolNumber.trim());
      if (academicYear.trim()) params.set('academicYear', academicYear.trim());
      if (classId) params.set('classId', classId);
      if (examId) params.set('examId', examId);
      const response = await api.getSingle<SearchResult>(`/results/search?${params.toString()}`);
      setResult(response.data);
    } catch (e: any) {
      setError(e?.response?.data?.message || 'No published result was found for the supplied details.');
    } finally { setLoading(false); }
  };

  const reset = () => { setRollNumber(''); setSymbolNumber(''); setAcademicYear(''); setClassId(''); setExamId(''); setResult(null); setError(''); };

  return (
    <>
      <SiteSeo title="Class 11 & 12 Results" description={`Search published Class 11 and 12 examination results at ${schoolName}.`} />
      <div className="min-h-screen bg-gray-50">
        <section className="bg-primary-700 text-white py-16"><div className="container-custom"><div className="flex items-center gap-3 mb-4"><Trophy className="w-8 h-8" /><Badge variant="secondary">Results Portal</Badge></div><h1 className="font-heading font-bold text-4xl md:text-5xl">Class 11 & 12 Results</h1><p className="mt-4 text-primary-100 max-w-2xl">Search published results by roll number or symbol number, with optional class, exam and academic year filters.</p></div></section>
        <section className="section"><div className="container-custom max-w-5xl"><Card><form onSubmit={search} className="grid md:grid-cols-2 gap-5"><Input label="Roll Number" value={rollNumber} onChange={(e) => setRollNumber(e.target.value)} placeholder="e.g. 12" /><Input label="Symbol Number" value={symbolNumber} onChange={(e) => setSymbolNumber(e.target.value)} placeholder="e.g. 2082-12345" /><Select label="Class" value={classId} onChange={(e) => setClassId(e.target.value)} options={classes.filter(c => /11|12/.test(c.name)).map(c => ({ value: c._id, label: c.name }))} placeholder={metaLoading ? 'Loading classes...' : 'Any class'} /><Select label="Examination" value={examId} onChange={(e) => setExamId(e.target.value)} options={exams.map(e => ({ value: e._id, label: `${e.name} (${e.academicYear ?? ''})` }))} placeholder={metaLoading ? 'Loading exams...' : 'Any published exam'} /><Input label="Academic Year" value={academicYear} onChange={(e) => setAcademicYear(e.target.value)} placeholder="e.g. 2082" /><div className="flex gap-3 items-end"><Button type="submit" loading={loading} className="flex-1"><Search className="w-4 h-4 mr-2" /> Search Result</Button><Button type="button" variant="outline" onClick={reset}>Reset</Button></div></form>{error && <div className="mt-5 p-4 rounded-lg bg-red-50 text-red-700 flex items-start gap-3"><AlertCircle className="w-5 h-5 mt-0.5" />{error}</div>}</Card>
          {result && <Card className="mt-8" id="result-sheet"><div className="flex flex-wrap justify-between gap-4 mb-6"><div><h2 className="font-heading text-2xl font-bold">{result.student.name}</h2><p className="text-gray-500 mt-1">Class: {result.student.class?.name ?? '—'} · Roll: {result.student.rollNumber ?? '—'} · Symbol: {result.student.symbolNumber ?? result.student.admissionNumber ?? '—'}</p></div><div className="flex gap-2 print:hidden"><Button variant="outline" onClick={() => window.print()}><Printer className="w-4 h-4 mr-2" /> Print</Button><Button onClick={() => window.print()}><Download className="w-4 h-4 mr-2" /> Save PDF</Button></div></div><div className="overflow-x-auto"><table className="w-full text-sm"><thead><tr className="border-b text-left"><th className="py-3 pr-3">Exam</th><th className="py-3 pr-3">Subject</th><th className="py-3 pr-3">Marks</th><th className="py-3 pr-3">Grade</th><th className="py-3">Status</th></tr></thead><tbody>{result.results.map((row: any, index: number) => <tr key={row._id ?? index} className="border-b last:border-0"><td className="py-3 pr-3">{row.exam?.name ?? row.examName ?? '—'}</td><td className="py-3 pr-3">{row.subject?.name ?? '—'}</td><td className="py-3 pr-3">{row.marksObtained}/{row.maxMarks}</td><td className="py-3 pr-3">{row.grade ?? '—'}</td><td className="py-3"><Badge variant={row.isPass ? 'success' : 'danger'}>{row.isPass ? 'Pass' : 'Fail'}</Badge></td></tr>)}</tbody></table></div></Card>}
        </div></section>
      </div>
    </>
  );
}
