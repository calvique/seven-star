import React, { useState, useEffect } from 'react';
import { SiteSeo } from '../../components/seo/SiteSeo';
import { ArrowLeft, Calendar, Clock, MapPin, Phone, Mail, User, Users, GraduationCap, FileText, CheckCircle, AlertCircle, Loader, ChevronLeft, ChevronRight, X, Download, Home, Building, Shield } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, Badge, Button, Input, Select, Textarea, Modal, Tabs, TabPanel } from '../../components/ui';
import { useSettings } from '../../context/SettingsContext';
import { api } from '../../services/api';
import type { Class as ClassType } from '../../types';

export function Admissions() {
  const { getSettingValue } = useSettings();
  const [classes, setClasses] = useState<ClassType[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formStep, setFormStep] = useState(1);
  const [formData, setFormData] = useState({
    // Personal
    firstName: '',
    middleName: '',
    lastName: '',
    dateOfBirth: '',
    gender: '',
    bloodGroup: '',
    nationality: 'Nepali',
    religion: '',
    motherTongue: '',
    previousSchool: '',
    previousClass: '',
    // Parents
    fatherName: '',
    fatherOccupation: '',
    fatherPhone: '',
    fatherEmail: '',
    fatherOfficeAddress: '',
    motherName: '',
    motherOccupation: '',
    motherPhone: '',
    motherEmail: '',
    motherOfficeAddress: '',
    // Guardian
    guardianName: '',
    guardianRelation: '',
    guardianPhone: '',
    guardianAddress: '',
    // Address
    permanentProvince: '',
    permanentDistrict: '',
    permanentMunicipality: '',
    permanentWard: '',
    permanentTole: '',
    tempProvince: '',
    tempDistrict: '',
    tempMunicipality: '',
    tempWard: '',
    tempTole: '',
    // Academic
    applyingForClass: '',
    academicYear: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [admissionResult, setAdmissionResult] = useState<any>(null);
  const [classesLoading, setClassesLoading] = useState(true);

  const schoolName = getSettingValue('general', 'school.name', 'Seven Star English Boarding School');
  const phone = getSettingValue('general', 'school.phone', '');
  const email = getSettingValue('general', 'school.email', '');
  const address = getSettingValue('general', 'school.address', 'Devdaha-2, Rupandehi, Nepal');
  const officeHours = getSettingValue('general', 'school.officeHours', '');

  const provinces = [
    'Koshi', 'Madhesh', 'Bagmati', 'Gandaki', 'Lumbini', 'Karnali', 'Sudurpashchim'
  ];

  const bloodGroups = ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'];
  const genders = ['male', 'female', 'other'];

  useEffect(() => {
    const fetchClasses = async () => {
      try {
        const res = await api.get('/classes/by-level', { isActive: true });
        if (res.success) setClasses(res.data.classes || []);
      } catch (error) {
        console.error('Failed to fetch classes:', error);
      } finally {
        setClassesLoading(false);
        setLoading(false);
      }
    };
    fetchClasses();
  }, []);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    if (step === 1) {
      if (!formData.firstName.trim()) newErrors.firstName = 'First name is required';
      if (!formData.lastName.trim()) newErrors.lastName = 'Last name is required';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date of birth is required';
      if (!formData.gender) newErrors.gender = 'Gender is required';
      if (!formData.applyingForClass) newErrors.applyingForClass = 'Please select a class';
    }
    
    if (step === 2) {
      if (!formData.fatherName.trim()) newErrors.fatherName = 'Father name is required';
      if (!formData.fatherPhone.trim()) newErrors.fatherPhone = 'Father phone is required';
      if (!formData.motherName.trim()) newErrors.motherName = 'Mother name is required';
      if (!formData.motherPhone.trim()) newErrors.motherPhone = 'Mother phone is required';
    }
    
    if (step === 3) {
      if (!formData.permanentProvince) newErrors.permanentProvince = 'Province is required';
      if (!formData.permanentDistrict) newErrors.permanentDistrict = 'District is required';
      if (!formData.permanentMunicipality) newErrors.permanentMunicipality = 'Municipality is required';
      if (!formData.permanentWard) newErrors.permanentWard = 'Ward is required';
      if (!formData.permanentTole) newErrors.permanentTole = 'Tole is required';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(formStep)) return;
    
    setSubmitting(true);
    try {
      const res: any = await api.post('/admissions', formData);
      if (res.success) {
        setSubmitted(true);
        setAdmissionResult(res.data.admission);
      }
    } catch (error: any) {
      console.error('Admission submission failed:', error);
      alert(error.response?.data?.message || 'Failed to submit admission. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const nextStep = () => {
    if (validateStep(formStep)) {
      setFormStep(prev => Math.min(prev + 1, 4));
    }
  };

  const prevStep = () => {
    setFormStep(prev => Math.max(prev - 1, 1));
  };

  const progressSteps = [
    { label: 'Personal', step: 1 },
    { label: 'Parents', step: 2 },
    { label: 'Address', step: 3 },
    { label: 'Academic', step: 4 },
  ];

  return (
    <>
      <SiteSeo title="Admissions" description={`Admission applications and official requirements published by ${schoolName}.`} />

      <div className="min-h-screen bg-white">
        <section className="bg-gradient-to-br from-primary-700 via-primary-800 to-primary-950 text-white py-20 lg:py-28">
          <div className="container-custom">
            <Link to="/" className="inline-flex items-center gap-2 text-primary-100 hover:text-white mb-6"><ArrowLeft className="w-5 h-5" /> Back to Home</Link>
            <Badge variant="secondary" className="mb-6">Online Admissions</Badge>
            <h1 className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl leading-tight">Admission application</h1>
            <p className="text-lg md:text-xl text-primary-100 mt-5 max-w-3xl">Submit an admission enquiry using the online form. Admission dates, requirements, fees and published class availability are controlled by the administration.</p>
            <div className="flex flex-wrap gap-5 mt-7 text-sm text-primary-100">
              <span className="inline-flex items-center gap-2"><MapPin className="w-4 h-4" />{address}</span>
              {phone && <span className="inline-flex items-center gap-2"><Phone className="w-4 h-4" />{phone}</span>}
              {email && <span className="inline-flex items-center gap-2"><Mail className="w-4 h-4" />{email}</span>}
            </div>
          </div>
        </section>

        <section className="section bg-gray-50">
          <div className="container-custom">
            <Card>
              <div className="flex items-start gap-4">
                <GraduationCap className="w-9 h-9 text-primary-600 flex-shrink-0" />
                <div><h2 className="font-heading font-bold text-xl">Published classes</h2><p className="text-gray-600 mt-2">{classes.length ? `${classes.length} active class${classes.length === 1 ? '' : 'es'} are currently available in the public academic structure.` : 'No classes have been published for applications yet.'}</p></div>
              </div>
            </Card>
          </div>
        </section>

        {/* Online Application Form */}
        {!submitted && (
          <section className="section bg-white">
            <div className="container-custom">
              <div className="max-w-4xl mx-auto">
                <div className="text-center mb-10">
                  <Badge variant="primary" className="mb-4">Online Application</Badge>
                  <h2 className="font-heading font-bold text-3xl md:text-4xl text-gray-900 mb-4">
                    Submit an Admission Application
                  </h2>
                  <p className="text-lg text-gray-600">
                    Complete the application in the steps shown below. Required fields are validated before submission.
                  </p>
                </div>

                {/* Progress Bar */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    {progressSteps.map((step, index) => (
                      <div key={step.step} className="flex flex-col items-center flex-1 relative">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-medium transition-all ${
                          formStep >= step.step
                            ? 'bg-primary-600 text-white'
                            : 'bg-gray-200 text-gray-500'
                        }`}>
                          {formStep > step.step ? <CheckCircle className="w-5 h-5" /> : step.step}
                        </div>
                        <span className={`text-sm font-medium mt-2 ${formStep >= step.step ? 'text-primary-600' : 'text-gray-500'}`}>
                          {step.label}
                        </span>
                        {index < progressSteps.length - 1 && (
                          <div className={`absolute top-5 left-[50%] w-full h-1 ${formStep > index + 1 ? 'bg-primary-600' : 'bg-gray-200'}`} />
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                <form onSubmit={handleSubmit} className="bg-gray-50 rounded-2xl p-8">
                  {/* Step 1: Personal Info */}
                  {formStep === 1 && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4 flex items-center gap-2">
                        <User className="w-6 h-6 text-primary-600" />
                        Student Personal Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <Input
                          label="First Name *"
                          value={formData.firstName}
                          onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                          error={errors.firstName}
                          placeholder="First name"
                        />
                        <Input
                          label="Middle Name"
                          value={formData.middleName}
                          onChange={(e) => setFormData({...formData, middleName: e.target.value})}
                          placeholder="Middle name (optional)"
                        />
                        <Input
                          label="Last Name *"
                          value={formData.lastName}
                          onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                          error={errors.lastName}
                          placeholder="Last name"
                        />
                        <Input
                          label="Date of Birth *"
                          type="date"
                          value={formData.dateOfBirth}
                          onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                          error={errors.dateOfBirth}
                        />
                        <Select
                          label="Gender *"
                          value={formData.gender}
                          onChange={(e) => setFormData({...formData, gender: e.target.value})}
                          error={errors.gender}
                          options={genders.map(g => ({ value: g, label: g.charAt(0).toUpperCase() + g.slice(1) }))}
                          placeholder="Select gender"
                        />
                        <Select
                          label="Blood Group"
                          value={formData.bloodGroup}
                          onChange={(e) => setFormData({...formData, bloodGroup: e.target.value})}
                          options={bloodGroups.map(b => ({ value: b, label: b }))}
                          placeholder="Select blood group"
                        />
                        <Input
                          label="Nationality"
                          value={formData.nationality}
                          onChange={(e) => setFormData({...formData, nationality: e.target.value})}
                          placeholder="Nepali"
                        />
                        <Input
                          label="Religion"
                          value={formData.religion}
                          onChange={(e) => setFormData({...formData, religion: e.target.value})}
                          placeholder="Hindu, Buddhist, etc."
                        />
                        <Input
                          label="Mother Tongue"
                          value={formData.motherTongue}
                          onChange={(e) => setFormData({...formData, motherTongue: e.target.value})}
                          placeholder="Nepali, Maithili, etc."
                        />
                        <Input
                          label="Previous School"
                          value={formData.previousSchool}
                          onChange={(e) => setFormData({...formData, previousSchool: e.target.value})}
                          placeholder="Name of previous school (if any)"
                        />
                        <Input
                          label="Previous Class"
                          value={formData.previousClass}
                          onChange={(e) => setFormData({...formData, previousClass: e.target.value})}
                          placeholder="Class studied in previous school"
                        />
                      </div>
                    </div>
                  )}

                  {/* Step 2: Parents Info */}
                  {formStep === 2 && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4 flex items-center gap-2">
                        <Users className="w-6 h-6 text-primary-600" />
                        Parents / Guardians Information
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                          <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" /> Father's Information
                          </h4>
                          <Input
                            label="Father's Name *"
                            value={formData.fatherName}
                            onChange={(e) => setFormData({...formData, fatherName: e.target.value})}
                            error={errors.fatherName}
                          />
                          <Input
                            label="Father's Occupation"
                            value={formData.fatherOccupation}
                            onChange={(e) => setFormData({...formData, fatherOccupation: e.target.value})}
                            placeholder="e.g., Business, Service, Agriculture"
                          />
                          <Input
                            label="Father's Phone *"
                            type="tel"
                            value={formData.fatherPhone}
                            onChange={(e) => setFormData({...formData, fatherPhone: e.target.value})}
                            error={errors.fatherPhone}
                            placeholder="98XXXXXXXX"
                          />
                          <Input
                            label="Father's Email"
                            type="email"
                            value={formData.fatherEmail}
                            onChange={(e) => setFormData({...formData, fatherEmail: e.target.value})}
                            placeholder="father@email.com"
                          />
                          <Input
                            label="Father's Office Address"
                            value={formData.fatherOfficeAddress}
                            onChange={(e) => setFormData({...formData, fatherOfficeAddress: e.target.value})}
                            placeholder="Office address (optional)"
                          />
                        </div>
                        
                        <div className="p-4 bg-pink-50 rounded-xl border border-pink-100">
                          <h4 className="font-semibold text-pink-800 mb-4 flex items-center gap-2">
                            <User className="w-5 h-5" /> Mother's Information
                          </h4>
                          <Input
                            label="Mother's Name *"
                            value={formData.motherName}
                            onChange={(e) => setFormData({...formData, motherName: e.target.value})}
                            error={errors.motherName}
                          />
                          <Input
                            label="Mother's Occupation"
                            value={formData.motherOccupation}
                            onChange={(e) => setFormData({...formData, motherOccupation: e.target.value})}
                            placeholder="e.g., Homemaker, Service, Business"
                          />
                          <Input
                            label="Mother's Phone *"
                            type="tel"
                            value={formData.motherPhone}
                            onChange={(e) => setFormData({...formData, motherPhone: e.target.value})}
                            error={errors.motherPhone}
                            placeholder="98XXXXXXXX"
                          />
                          <Input
                            label="Mother's Email"
                            type="email"
                            value={formData.motherEmail}
                            onChange={(e) => setFormData({...formData, motherEmail: e.target.value})}
                            placeholder="mother@email.com"
                          />
                          <Input
                            label="Mother's Office Address"
                            value={formData.motherOfficeAddress}
                            onChange={(e) => setFormData({...formData, motherOfficeAddress: e.target.value})}
                            placeholder="Office address (optional)"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                          <Shield className="w-5 h-5" /> Guardian Information (Optional)
                        </h4>
                        <div className="grid md:grid-cols-3 gap-4">
                          <Input
                            label="Guardian's Name"
                            value={formData.guardianName}
                            onChange={(e) => setFormData({...formData, guardianName: e.target.value})}
                            placeholder="If different from parents"
                          />
                          <Input
                            label="Relation"
                            value={formData.guardianRelation}
                            onChange={(e) => setFormData({...formData, guardianRelation: e.target.value})}
                            placeholder="Uncle, Aunt, etc."
                          />
                          <Input
                            label="Guardian's Phone"
                            type="tel"
                            value={formData.guardianPhone}
                            onChange={(e) => setFormData({...formData, guardianPhone: e.target.value})}
                            placeholder="98XXXXXXXX"
                          />
                          <Input
                            label="Guardian's Address"
                            value={formData.guardianAddress}
                            onChange={(e) => setFormData({...formData, guardianAddress: e.target.value})}
                            placeholder="Address (optional)"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Address */}
                  {formStep === 3 && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4 flex items-center gap-2">
                        <MapPin className="w-6 h-6 text-primary-600" />
                        Address Information
                      </h3>
                      
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-4 flex items-center gap-2">
                          <Home className="w-5 h-5" /> Permanent Address *
                        </h4>
                        <div className="grid md:grid-cols-5 gap-4">
                          <Select
                            label="Province *"
                            value={formData.permanentProvince}
                            onChange={(e) => setFormData({...formData, permanentProvince: e.target.value})}
                            error={errors.permanentProvince}
                            options={provinces.map(p => ({ value: p, label: p }))}
                            placeholder="Select province"
                          />
                          <Input
                            label="District *"
                            value={formData.permanentDistrict}
                            onChange={(e) => setFormData({...formData, permanentDistrict: e.target.value})}
                            error={errors.permanentDistrict}
                            placeholder="e.g., Rupandehi"
                          />
                          <Input
                            label="Municipality *"
                            value={formData.permanentMunicipality}
                            onChange={(e) => setFormData({...formData, permanentMunicipality: e.target.value})}
                            error={errors.permanentMunicipality}
                            placeholder="e.g., Devdaha"
                          />
                          <Input
                            label="Ward *"
                            value={formData.permanentWard}
                            onChange={(e) => setFormData({...formData, permanentWard: e.target.value})}
                            error={errors.permanentWard}
                            placeholder="e.g., 2"
                          />
                          <Input
                            label="Tole *"
                            value={formData.permanentTole}
                            onChange={(e) => setFormData({...formData, permanentTole: e.target.value})}
                            error={errors.permanentTole}
                            placeholder="e.g., Pipaldanda"
                          />
                        </div>
                      </div>
                      
                      <div className="p-4 bg-gray-50 rounded-xl border border-gray-200">
                        <h4 className="font-semibold text-gray-800 mb-4 flex items-center gap-2">
                          <MapPin className="w-5 h-5" /> Temporary Address (Optional)
                        </h4>
                        <div className="grid md:grid-cols-5 gap-4">
                          <Select
                            label="Province"
                            value={formData.tempProvince}
                            onChange={(e) => setFormData({...formData, tempProvince: e.target.value})}
                            options={provinces.map(p => ({ value: p, label: p }))}
                            placeholder="Select province"
                          />
                          <Input
                            label="District"
                            value={formData.tempDistrict}
                            onChange={(e) => setFormData({...formData, tempDistrict: e.target.value})}
                            placeholder="District"
                          />
                          <Input
                            label="Municipality"
                            value={formData.tempMunicipality}
                            onChange={(e) => setFormData({...formData, tempMunicipality: e.target.value})}
                            placeholder="Municipality"
                          />
                          <Input
                            label="Ward"
                            value={formData.tempWard}
                            onChange={(e) => setFormData({...formData, tempWard: e.target.value})}
                            placeholder="Ward"
                          />
                          <Input
                            label="Tole"
                            value={formData.tempTole}
                            onChange={(e) => setFormData({...formData, tempTole: e.target.value})}
                            placeholder="Tole"
                          />
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Academic */}
                  {formStep === 4 && (
                    <div className="space-y-6 animate-fade-in">
                      <h3 className="font-heading font-semibold text-xl text-gray-900 mb-4 flex items-center gap-2">
                        <GraduationCap className="w-6 h-6 text-primary-600" />
                        Academic Details
                      </h3>
                      
                      <div className="grid md:grid-cols-2 gap-6">
                        <Select
                          label="Applying For Class *"
                          value={formData.applyingForClass}
                          onChange={(e) => setFormData({...formData, applyingForClass: e.target.value})}
                          error={errors.applyingForClass}
                          options={classes.map(c => ({ value: c._id, label: `${c.name} (${c.code})` }))}
                          placeholder={classesLoading ? 'Loading classes...' : 'Select class'}
                          disabled={classesLoading}
                        />
                        <Input
                          label="Academic Year"
                          value={formData.academicYear}
                          onChange={(e) => setFormData({...formData, academicYear: e.target.value})}
                          placeholder="Academic year, if announced"
                        />
                      </div>
                      
                      <div className="p-4 bg-green-50 rounded-xl border border-green-100">
                        <h4 className="font-semibold text-green-800 mb-4 flex items-center gap-2">
                          <CheckCircle className="w-5 h-5" /> Documents Required
                        </h4>
                        <ul className="space-y-2 text-sm text-gray-700">
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Birth Certificate</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Transfer Certificate (if applicable)</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Previous Class Mark Sheet</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Passport Size Photos (4 copies)</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Father's Citizenship Copy</li>
                          <li className="flex items-center gap-2"><CheckCircle className="w-4 h-4 text-green-500" /> Mother's Citizenship Copy</li>
                        </ul>
                      </div>
                      
                      <div className="p-4 bg-blue-50 rounded-xl border border-blue-100">
                        <h4 className="font-semibold text-blue-800 mb-2">Admission Process</h4>
                        <ol className="space-y-1 text-sm text-gray-700 list-decimal list-inside">
                          <li>Submit online application form</li>
                          <li>School reviews application (3-5 working days)</li>
                          <li>Interview/assessment scheduled (if required)</li>
                          <li>Admission decision communicated</li>
                          <li>Complete formalities & fee payment</li>
                          <li>Student enrolled & orientation scheduled</li>
                        </ol>
                      </div>
                    </div>
                  )}

                  {/* Navigation Buttons */}
                  <div className="flex justify-between pt-6 border-t border-gray-200">
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={prevStep}
                      disabled={formStep === 1}
                    >
                      <ChevronLeft className="w-4 h-4 mr-2" />
                      Previous
                    </Button>
                    {formStep < 4 ? (
                      <Button type="button" onClick={nextStep}>
                        Next <ChevronRight className="w-4 h-4 ml-2" />
                      </Button>
                    ) : (
                      <Button type="submit" loading={submitting} className="w-full md:w-auto">
                        {submitting ? 'Submitting...' : 'Submit Application'}
                      </Button>
                    )}
                  </div>
                </form>
              </div>
            </div>
          </section>
        )}

        {/* Success Message */}
        {submitted && (
          <section className="section bg-white">
            <div className="container-custom">
              <div className="max-w-2xl mx-auto text-center">
                <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
                  <CheckCircle className="w-12 h-12 text-green-600" />
                </div>
                <h2 className="font-heading font-bold text-3xl text-gray-900 mb-4">
                  Application Submitted Successfully!
                </h2>
                <p className="text-lg text-gray-600 mb-8">
                  Thank you for applying to {schoolName}. Your admission application has been received.
                </p>
                <Card className="bg-green-50 border-green-200 mb-8">
                  <div className="space-y-3">
                    <p className="font-semibold text-green-800">Admission Number: <span className="font-mono">{admissionResult?.admissionNumber}</span></p>
                    <p className="text-green-700">Academic Year: {admissionResult?.academicYear}</p>
                    <p className="text-green-700">Class Applied: {admissionResult?.applyingForClass?.name}</p>
                    <p className="text-green-700">Student: {formData.firstName} {formData.lastName}</p>
                    <p className="text-sm text-green-600">We will review your application and contact you within 3-5 working days.</p>
                  </div>
                </Card>
                <div className="flex flex-wrap justify-center gap-4">
                  <Link to="/admissions">
                    <Button variant="secondary">Submit Another Application</Button>
                  </Link>
                  <Link to="/">
                    <Button variant="outline">Back to Home</Button>
                  </Link>
                </div>
              </div>
            </div>
          </section>
        )}

        {/* Contact Info */}
        <section className="bg-gray-900 text-white py-16">
          <div className="container-custom">
            <div className="grid md:grid-cols-3 gap-8 text-center">
              <div>
                <Phone className="w-8 h-8 text-secondary-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Call Us</h3>
                <a href={`tel:${phone}`} className="text-white hover:text-secondary-300 transition-colors">{phone}</a>
              </div>
              <div>
                <Mail className="w-8 h-8 text-secondary-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Email Us</h3>
                <a href={`mailto:${email}`} className="text-white hover:text-secondary-300 transition-colors">{email}</a>
              </div>
              <div>
                <MapPin className="w-8 h-8 text-secondary-400 mx-auto mb-3" />
                <h3 className="font-semibold text-lg mb-2">Visit Us</h3>
                <p className="text-white/80">{address}</p>
                <p className="text-white/60 text-sm">{officeHours}</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}