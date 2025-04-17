'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { ArrowLeft, Phone, Clock, AlertTriangle, Truck, Heart, Stethoscope, Users } from 'lucide-react';

export default function AmbulanceInfoPage() {
  return (
    <div className="container py-8">
      <Link href="/services/ambulance" className="mb-4 flex items-center text-muted-foreground hover:text-foreground">
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Ambulance Services
      </Link>

      <div className="relative mb-8 overflow-hidden rounded-lg">
        <img 
          src="https://images.unsplash.com/photo-1587745416684-47953f16f02f?w=1200&auto=format&fit=crop" 
          alt="Ambulance Services" 
          className="h-64 w-full object-cover"
        />
        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
          <h1 className="text-4xl font-bold text-white">Ambulance Services Guide</h1>
        </div>
      </div>

      <div className="mb-8">
        <p className="mb-4 text-lg">
          Ambulance services provide critical emergency medical transportation and care. This guide will help you understand when to call an ambulance, what to expect, and how to prepare for emergency situations.
        </p>
      </div>

      <Tabs defaultValue="when-to-call" className="mb-8">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="when-to-call">When to Call</TabsTrigger>
          <TabsTrigger value="what-to-expect">What to Expect</TabsTrigger>
          <TabsTrigger value="types">Types of Services</TabsTrigger>
          <TabsTrigger value="costs">Costs & Coverage</TabsTrigger>
        </TabsList>
        
        <TabsContent value="when-to-call" className="mt-6">
          <Card>
            <CardHeader>
              <AlertTriangle className="mb-2 h-6 w-6 text-red-500" />
              <CardTitle>When to Call an Ambulance</CardTitle>
              <CardDescription>Recognizing emergency situations that require immediate medical attention</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Call an Ambulance Immediately For:</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div><strong>Chest Pain or Pressure:</strong> Especially if accompanied by shortness of breath, sweating, or pain radiating to the arm or jaw.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div><strong>Difficulty Breathing:</strong> Severe shortness of breath or inability to speak in complete sentences.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div><strong>Stroke Symptoms:</strong> Sudden numbness or weakness (especially on one side), confusion, trouble speaking, vision problems, severe headache, or difficulty walking.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div><strong>Severe Injuries:</strong> Major trauma, deep wounds, severe burns, or suspected broken bones in the neck, back, or hip.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div><strong>Uncontrolled Bleeding:</strong> Bleeding that doesn't stop with direct pressure.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div><strong>Seizures:</strong> Especially if lasting more than 5 minutes, occurring in water, or if the person has never had a seizure before.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div><strong>Unconsciousness:</strong> When a person is unresponsive or has fainted and doesn't quickly regain consciousness.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-100 text-red-500">!</span>
                    <div><strong>Severe Allergic Reaction:</strong> Difficulty breathing, swelling of the face/throat, or severe hives.</div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-2 text-lg font-medium">When Calling 911:</h3>
                <ol className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">1</span>
                    <div>Stay calm and speak clearly</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">2</span>
                    <div>Provide your exact location (address, landmarks, floor/apartment number)</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">3</span>
                    <div>Describe the emergency and the condition of the patient</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">4</span>
                    <div>Answer all questions from the dispatcher</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">5</span>
                    <div>Stay on the line until instructed to hang up</div>
                  </li>
                </ol>
              </div>
            </CardContent>
            <CardFooter>
              <Button className="w-full" variant="destructive">
                Emergency: Call 911
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        
        <TabsContent value="what-to-expect" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>What to Expect When an Ambulance Arrives</CardTitle>
              <CardDescription>Understanding the emergency response process</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">The Ambulance Team</h3>
                <p className="mb-4">Ambulances are typically staffed by trained professionals:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Emergency Medical Technicians (EMTs):</strong> Provide basic life support and emergency care.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Paramedics:</strong> Advanced providers who can administer medications, perform advanced procedures, and provide advanced life support.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Emergency Medical Responders:</strong> May assist EMTs and paramedics in some areas.</div>
                  </li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">The Response Process</h3>
                <ol className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">1</span>
                    <div><strong>Initial Assessment:</strong> The team will quickly evaluate the patient's condition.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">2</span>
                    <div><strong>Stabilization:</strong> They will provide immediate care to stabilize the patient's condition.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">3</span>
                    <div><strong>Information Gathering:</strong> They'll ask about medical history, allergies, medications, and what happened.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">4</span>
                    <div><strong>Transport Decision:</strong> They'll determine if the patient needs to go to the hospital and which facility is most appropriate.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">5</span>
                    <div><strong>En Route Care:</strong> Continued monitoring and treatment during transportation.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">6</span>
                    <div><strong>Hospital Transfer:</strong> The team will communicate with hospital staff about the patient's condition.</div>
                  </li>
                </ol>
              </div>
              
              <div>
                <h3 className="mb-2 text-lg font-medium">How to Help the Ambulance Team</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>Have a list of the patient's medications ready if possible</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>Provide information about medical conditions and allergies</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>Clear a path for the stretcher if needed</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>Keep pets secured in another room</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div>Gather the patient's ID and insurance information if possible</div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="types" className="mt-6">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <Truck className="mb-2 h-6 w-6 text-primary" />
                <CardTitle>Types of Ambulance Services</CardTitle>
                <CardDescription>Different levels of emergency medical transportation</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <h4 className="font-medium">Basic Life Support (BLS) Ambulances</h4>
                    <p className="text-sm text-muted-foreground">Equipped to provide basic emergency care, including CPR, first aid, and oxygen administration. Staffed by EMTs.</p>
                  </li>
                  <li>
                    <h4 className="font-medium">Advanced Life Support (ALS) Ambulances</h4>
                    <p className="text-sm text-muted-foreground">Equipped with advanced medical equipment and medications. Staffed by paramedics who can perform advanced procedures like intubation and administer medications.</p>
                  </li>
                  <li>
                    <h4 className="font-medium">Critical Care Transport</h4>
                    <p className="text-sm text-muted-foreground">Specialized ambulances for transferring critically ill patients between facilities. Often staffed with critical care nurses or physicians in addition to paramedics.</p>
                  </li>
                  <li>
                    <h4 className="font-medium">Air Ambulances</h4>
                    <p className="text-sm text-muted-foreground">Helicopters or fixed-wing aircraft used for rapid transport over long distances or difficult terrain. Staffed with flight paramedics or flight nurses.</p>
                  </li>
                  <li>
                    <h4 className="font-medium">Non-Emergency Medical Transport</h4>
                    <p className="text-sm text-muted-foreground">For patients who need medical monitoring during transport but are not in an emergency situation. Often used for scheduled medical appointments or facility transfers.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <Heart className="mb-2 h-6 w-6 text-primary" />
                <CardTitle>Specialized Ambulance Services</CardTitle>
                <CardDescription>Services tailored to specific medical needs</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  <li>
                    <h4 className="font-medium">Neonatal/Pediatric Transport</h4>
                    <p className="text-sm text-muted-foreground">Specially equipped ambulances for transporting infants and children with specialized pediatric equipment and staff trained in pediatric emergency care.</p>
                  </li>
                  <li>
                    <h4 className="font-medium">Bariatric Ambulances</h4>
                    <p className="text-sm text-muted-foreground">Designed to safely transport patients who are obese or overweight, with specialized equipment and larger interior space.</p>
                  </li>
                  <li>
                    <h4 className="font-medium">Mobile Intensive Care Units (MICU)</h4>
                    <p className="text-sm text-muted-foreground">Essentially mobile ICUs with advanced monitoring and life support equipment for critically ill patients.</p>
                  </li>
                  <li>
                    <h4 className="font-medium">Disaster Response Units</h4>
                    <p className="text-sm text-muted-foreground">Ambulances equipped for mass casualty incidents and disaster situations, often with additional supplies and equipment.</p>
                  </li>
                  <li>
                    <h4 className="font-medium">Mental Health Transport</h4>
                    <p className="text-sm text-muted-foreground">Specialized services for safely transporting patients experiencing mental health crises, with staff trained in mental health care.</p>
                  </li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="costs" className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Costs and Insurance Coverage</CardTitle>
              <CardDescription>Understanding ambulance service expenses</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Typical Ambulance Costs</h3>
                <p className="mb-2">Ambulance services can be expensive, with costs varying based on several factors:</p>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Base Rate:</strong> The standard charge for ambulance dispatch, typically $500-$1,000.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Mileage:</strong> Additional per-mile charges, usually $10-$30 per mile.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Level of Service:</strong> ALS services cost more than BLS services.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Supplies and Medications:</strong> Additional charges for medical supplies and medications used.</div>
                  </li>
                </ul>
              </div>
              
              <div className="mb-6">
                <h3 className="mb-2 text-lg font-medium">Insurance Coverage</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Private Insurance:</strong> Most plans cover ambulance services for medical emergencies, but may require that the service be "medically necessary." Coverage varies by plan.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Medicare:</strong> Covers ambulance services when other transportation could endanger your health and only to the nearest appropriate facility. Typically covers 80% of the Medicare-approved amount.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Medicaid:</strong> Coverage varies by state but generally covers emergency ambulance services.</div>
                  </li>
                </ul>
              </div>
              
              <div>
                <h3 className="mb-2 text-lg font-medium">Reducing Costs</h3>
                <ul className="space-y-2">
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Check Your Coverage:</strong> Understand what your insurance covers before an emergency.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Payment Plans:</strong> Many ambulance services offer payment plans for out-of-pocket expenses.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Financial Assistance:</strong> Some services have financial assistance programs for those who qualify.</div>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                    <div><strong>Appeal Denied Claims:</strong> If your insurance denies coverage, you have the right to appeal the decision.</div>
                  </li>
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Emergency Preparedness</h2>
        <div className="grid gap-6 md:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle>Create an Emergency Plan</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">1</span>
                  <div>Create a list of emergency contacts including family members, doctors, and neighbors</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">2</span>
                  <div>Keep a current list of medications, allergies, and medical conditions</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">3</span>
                  <div>Post emergency numbers in a visible location</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">4</span>
                  <div>Discuss the plan with all household members</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">5</span>
                  <div>Consider medical alert devices for vulnerable family members</div>
                </li>
              </ul>
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Prepare an Emergency Kit</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                  <div>List of current medications and dosages</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                  <div>Medical history summary for each family member</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                  <div>Insurance cards and identification</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                  <div>Emergency contact information</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                  <div>Basic first aid supplies</div>
                </li>
                <li className="flex items-start gap-2">
                  <span className="mt-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary/10 text-primary">•</span>
                  <div>Any essential medical devices or supplies</div>
                </li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mb-8">
        <h2 className="mb-4 text-2xl font-bold">Frequently Asked Questions</h2>
        <div className="space-y-4">
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Can I choose which hospital the ambulance takes me to?</h3>
            <p className="text-muted-foreground">In most cases, yes, you can request a specific hospital. However, in life-threatening emergencies, paramedics will take you to the nearest appropriate facility. Your preference may also be overridden if the hospital you request doesn't have the specialized care you need.</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">What if I call an ambulance but then refuse transport?</h3>
            <p className="text-muted-foreground">You have the right to refuse transport if you're mentally capable of making that decision. However, you may still be charged a response fee. The paramedics will ask you to sign a form acknowledging that you're refusing care against medical advice.</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">Can family members ride in the ambulance?</h3>
            <p className="text-muted-foreground">This depends on the service's policy and the situation. In many cases, one family member may be allowed to ride along, especially for pediatric patients. However, this may not be possible in critical situations where space is needed for treatment.</p>
          </div>
          <div className="rounded-lg border p-4">
            <h3 className="mb-2 font-medium">What's the difference between 911 and non-emergency medical transport?</h3>
            <p className="text-muted-foreground">911 ambulances are for emergencies requiring immediate medical attention. Non-emergency medical transport is for scheduled medical appointments or facility transfers for patients who need medical monitoring but aren't in an emergency situation.</p>
          </div>
        </div>
      </div>

      <div className="rounded-lg bg-primary/5 p-6">
        <h2 className="mb-4 text-2xl font-bold">Find Ambulance Services Near You</h2>
        <p className="mb-4">Browse our directory of verified ambulance services to find reliable emergency transportation in your area.</p>
        <Button asChild>
          <Link href="/services/ambulance">View All Ambulance Services</Link>
        </Button>
      </div>
    </div>
  );
}
