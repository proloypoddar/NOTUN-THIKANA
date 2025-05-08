'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Phone, MapPin, Clock, Info, FileText, Heart, Stethoscope, Users, AlertTriangle } from 'lucide-react';

export default function HospitalInfoPage() {
  return (
    <div className="container py-8">
      <Link href="/services/hospital" className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Hospitals
      </Link>

      <div className="relative mb-8 overflow-hidden rounded-lg">
        <img 
          src="https://images.unsplash.com/photo-1519494026892-80bbd2d6fd0d?w=1200&auto=format&fit=crop" 
          alt="Hospital Services" 
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Hospital Services Guide</h1>
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-4 text-lg">
          Hospitals provide essential medical care and emergency services. This guide will help you understand the different types of hospital services available, how to access them, and what to expect during your visit.
        </p>
      </div>

      <Tabs defaultValue="general" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="general">General Information</TabsTrigger>
          <TabsTrigger value="emergency">Emergency Services</TabsTrigger>
          <TabsTrigger value="specialties">Medical Specialties</TabsTrigger>
          <TabsTrigger value="insurance">Insurance & Payments</TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Info className="mb-2 h-6 w-6 text-primary" />
                <CardTitle>Types of Hospitals</CardTitle>
                <CardDescription>Understanding different hospital categories</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>
                      <strong>Public Hospitals:</strong> Government-funded facilities that provide care to all patients regardless of ability to pay.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>
                      <strong>Private Hospitals:</strong> Privately owned facilities that may offer more amenities and shorter wait times.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>
                      <strong>Teaching Hospitals:</strong> Affiliated with medical schools, offering advanced treatments and participating in research.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>
                      <strong>Specialty Hospitals:</strong> Focus on specific medical areas like children's health, cancer treatment, or rehabilitation.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <FileText className="mb-2 h-6 w-6 text-primary" />
                <CardTitle>What to Bring</CardTitle>
                <CardDescription>Essential items for your hospital visit</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>
                      <strong>Identification:</strong> Government-issued ID, passport, or driver's license.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>
                      <strong>Insurance Information:</strong> Insurance cards and any pre-authorization documents.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>
                      <strong>Medical History:</strong> List of current medications, allergies, and previous medical conditions.
                    </div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>
                      <strong>Personal Items:</strong> Comfortable clothing, toiletries, and any necessary personal items for overnight stays.
                    </div>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="emergency" className="mt-6">
          <Card>
            <CardHeader>
              <AlertTriangle className="mb-2 h-6 w-6 text-red-500" />
              <CardTitle>Emergency Services</CardTitle>
              <CardDescription>When and how to use emergency medical services</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">When to Go to the Emergency Room</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div>Difficulty breathing or shortness of breath</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div>Chest or upper abdominal pain or pressure</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div>Fainting, sudden dizziness, weakness</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div>Changes in vision or difficulty speaking</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div>Uncontrolled bleeding or severe burns</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div>Severe or persistent vomiting or diarrhea</div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-2 text-lg font-medium">Emergency Room Process</h3>
                <ol className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">1</span>
                    <div><strong>Triage:</strong> Patients are assessed based on the severity of their condition.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">2</span>
                    <div><strong>Registration:</strong> Providing personal and insurance information.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">3</span>
                    <div><strong>Evaluation:</strong> Medical assessment by healthcare professionals.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">4</span>
                    <div><strong>Treatment:</strong> Receiving appropriate medical care.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">5</span>
                    <div><strong>Discharge or Admission:</strong> Either returning home with instructions or being admitted to the hospital.</div>
                  </li>
                </ol>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="destructive">
                Call Emergency Services: 911
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="specialties" className="mt-6">
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardHeader>
                <Heart className="mb-2 h-6 w-6 text-primary" />
                <CardTitle>Cardiology</CardTitle>
                <CardDescription>Heart and cardiovascular system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Specializes in diagnosing and treating heart conditions including:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Coronary artery disease</li>
                  <li>• Heart failure</li>
                  <li>• Arrhythmias</li>
                  <li>• Valve disorders</li>
                  <li>• Congenital heart defects</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Stethoscope className="mb-2 h-6 w-6 text-primary" />
                <CardTitle>Neurology</CardTitle>
                <CardDescription>Brain and nervous system</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Focuses on disorders of the nervous system including:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Stroke</li>
                  <li>• Epilepsy</li>
                  <li>• Multiple sclerosis</li>
                  <li>• Parkinson's disease</li>
                  <li>• Headache disorders</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Users className="mb-2 h-6 w-6 text-primary" />
                <CardTitle>Pediatrics</CardTitle>
                <CardDescription>Children's health</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Provides medical care for infants, children, and adolescents:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Preventive care</li>
                  <li>• Developmental disorders</li>
                  <li>• Childhood illnesses</li>
                  <li>• Immunizations</li>
                  <li>• Growth and development monitoring</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Orthopedics</CardTitle>
                <CardDescription>Bones, joints, and muscles</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Treats conditions related to the musculoskeletal system:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Fractures and dislocations</li>
                  <li>• Arthritis</li>
                  <li>• Sports injuries</li>
                  <li>• Spine disorders</li>
                  <li>• Joint replacements</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Oncology</CardTitle>
                <CardDescription>Cancer diagnosis and treatment</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Specializes in the diagnosis and treatment of cancer:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Chemotherapy</li>
                  <li>• Radiation therapy</li>
                  <li>• Immunotherapy</li>
                  <li>• Targeted therapy</li>
                  <li>• Cancer screening and prevention</li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Obstetrics & Gynecology</CardTitle>
                <CardDescription>Women's health</CardDescription>
              </CardHeader>
              <CardContent>
                <p className="mb-2">Focuses on women's reproductive health:</p>
                <ul className="space-y-1 text-sm">
                  <li>• Pregnancy and childbirth</li>
                  <li>• Reproductive health</li>
                  <li>• Menstrual disorders</li>
                  <li>• Fertility issues</li>
                  <li>• Preventive care</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="insurance" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Insurance & Payment Information</CardTitle>
              <CardDescription>Understanding hospital costs and coverage</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Types of Insurance Accepted</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Private Insurance:</strong> Most hospitals accept major private insurance plans.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Government Insurance:</strong> Medicare, Medicaid, and other government programs.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>International Insurance:</strong> Some hospitals accept international health insurance for travelers.</div>
                  </li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Understanding Hospital Costs</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Deductibles:</strong> The amount you pay before your insurance begins to cover costs.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Copayments:</strong> Fixed amounts you pay for specific services.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Coinsurance:</strong> Percentage of costs you pay after meeting your deductible.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Out-of-pocket Maximum:</strong> The most you'll pay during a policy period before your insurance covers 100% of costs.</div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-2 text-lg font-medium">Financial Assistance</h3>
                <p className="mb-2">Many hospitals offer financial assistance programs for patients who cannot afford to pay for their care:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Charity Care:</strong> Free or discounted care for those who qualify based on income.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Payment Plans:</strong> Arrangements to pay bills over time without interest.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Financial Counseling:</strong> Assistance in understanding bills and finding payment options.</div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">How do I find the right hospital for my needs?</h3>
            <p className="text-muted-foreground">Consider factors like location, specialties offered, insurance acceptance, and recommendations from your primary care physician. You can also check hospital ratings and patient reviews online.</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">What's the difference between the emergency room and urgent care?</h3>
            <p className="text-muted-foreground">Emergency rooms are for life-threatening conditions requiring immediate attention. Urgent care centers handle non-life-threatening issues that need same-day care but aren't emergencies, often with shorter wait times and lower costs.</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">How can I prepare for a hospital stay?</h3>
            <p className="text-muted-foreground">Bring your ID, insurance card, medication list, comfortable clothing, toiletries, and any necessary personal items. Arrange for transportation home and help with household tasks during recovery. Complete any pre-admission testing as directed.</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">What rights do I have as a hospital patient?</h3>
            <p className="text-muted-foreground">Patients have rights to privacy, informed consent, access to medical records, respectful care, and participation in treatment decisions. You can request a copy of the patient rights document from your hospital.</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-primary/5 p-6">
        <h2 className="mb-4 text-2xl font-bold">Find a Hospital Near You</h2>
        <p className="mb-4">Browse our directory of verified hospitals to find quality healthcare services in your area.</p>
        <Button asChild>
          <Link href="/services/hospital">View All Hospitals</Link>
        </Button>
      </div>
    </div>
  );
}
