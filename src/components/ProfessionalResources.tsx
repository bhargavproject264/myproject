import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/Card';
import { Button } from './ui/Button';
import { Phone, MapPin, Clock, ExternalLink, AlertTriangle } from 'lucide-react';

export const ProfessionalResources: React.FC = () => {
  const emergencyContacts = [
    {
      name: "National Suicide Prevention Lifeline",
      phone: "988",
      description: "24/7 crisis support",
      type: "emergency"
    },
    {
      name: "Crisis Text Line",
      phone: "123456789",
      description: "24/7 crisis support via text",
      type: "emergency"
    },
    {
      name: "SAMHSA National Helpline",
      phone: "12456789558",
      description: "Treatment referral and information service",
      type: "support"
    }
  ];

  const onlineResources = [
    {
      name: "Talkspace",
      description: "Online therapy and psychiatry services",
      url: "https://www.talkspace.com",
      type: "therapy"
    },
    {
      name: "Psychology Today",
      description: "Find mental health professionals in your area",
      url: "https://www.psychologytoday.com",
      type: "directory"
    },
    {
      name: "Mental Health America",
      description: "Mental health resources and screening tools",
      url: "https://www.mhanational.org",
      type: "resources"
    }
  ];

  const localResources = [
    {
      name: "Community Mental Health Centers",
      description: "Low-cost mental health services in your community",
      tip: "Search for 'community mental health center' + your city name"
    },
    {
      name: "University Counseling Centers",
      description: "Many universities offer low-cost therapy services to the public",
      tip: "Contact nearby universities about their psychology training programs"
    },
    {
      name: "Religious/Spiritual Organizations",
      description: "Many offer counseling services or support groups",
      tip: "Check with local churches, temples, mosques, or other religious centers"
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Professional Resources</h2>
        <p className="text-sm text-gray-600">Connect with mental health professionals and support services</p>
      </div>

      {/* Emergency Contacts */}
      <Card className="border-l-4 border-l-red-500">
        <CardHeader>
          <div className="flex items-center space-x-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            <CardTitle className="text-red-800">Emergency Contacts</CardTitle>
          </div>
          <p className="text-sm text-red-700">If you're in immediate danger or having thoughts of suicide</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                <div>
                  <h4 className="font-medium text-red-800">{contact.name}</h4>
                  <p className="text-sm text-red-700">{contact.description}</p>
                </div>
                <div className="flex items-center space-x-2">
                  <Phone className="h-4 w-4 text-red-600" />
                  <span className="font-mono text-red-800">{contact.phone}</span>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Online Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Online Mental Health Services</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-4">
            {onlineResources.map((resource, index) => (
              <div key={index} className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50">
                <div>
                  <h4 className="font-medium text-gray-900">{resource.name}</h4>
                  <p className="text-sm text-gray-600">{resource.description}</p>
                  <span className="inline-block mt-1 px-2 py-1 text-xs bg-blue-100 text-blue-800 rounded">
                    {resource.type}
                  </span>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <a href={resource.url} target="_blank" rel="noopener noreferrer">
                    <ExternalLink className="h-4 w-4 mr-2" />
                    Visit
                  </a>
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Local Resources */}
      <Card>
        <CardHeader>
          <CardTitle>Local Resources</CardTitle>
          <p className="text-sm text-gray-600">Find affordable mental health services in your community</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {localResources.map((resource, index) => (
              <div key={index} className="p-4 border border-gray-200 rounded-lg">
                <div className="flex items-start space-x-3">
                  <MapPin className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <h4 className="font-medium text-gray-900">{resource.name}</h4>
                    <p className="text-sm text-gray-600 mt-1">{resource.description}</p>
                    <p className="text-sm text-blue-600 mt-2">
                      <strong>Tip:</strong> {resource.tip}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Cultural Considerations */}
      <Card>
        <CardHeader>
          <CardTitle>Cultural Considerations</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-medium text-blue-800">Finding Culturally Competent Care</h4>
              <ul className="text-sm text-blue-700 mt-2 space-y-1">
                <li>• Look for therapists who understand your cultural background</li>
                <li>• Ask about experience with your specific cultural or religious needs</li>
                <li>• Consider language preferences when selecting a provider</li>
                <li>• Don't hesitate to ask about cultural sensitivity during initial consultations</li>
              </ul>
            </div>
            
            <div className="p-4 bg-green-50 rounded-lg">
              <h4 className="font-medium text-green-800">Insurance and Financial Assistance</h4>
              <ul className="text-sm text-green-700 mt-2 space-y-1">
                <li>• Check if your insurance covers mental health services</li>
                <li>• Ask about sliding scale fees based on income</li>
                <li>• Look into Employee Assistance Programs (EAP) through your employer</li>
                <li>• Consider community mental health centers for low-cost options</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* When to Seek Help */}
      <Card>
        <CardHeader>
          <CardTitle>When to Seek Professional Help</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Immediate Help Needed</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Thoughts of suicide or self-harm</li>
                <li>• Severe depression or anxiety</li>
                <li>• Substance abuse issues</li>
                <li>• Inability to function in daily life</li>
                <li>• Psychotic symptoms</li>
              </ul>
            </div>
            <div>
              <h4 className="font-medium text-gray-900 mb-2">Consider Professional Support</h4>
              <ul className="text-sm text-gray-700 space-y-1">
                <li>• Persistent stress or worry</li>
                <li>• Difficulty managing emotions</li>
                <li>• Relationship problems</li>
                <li>• Sleep or appetite changes</li>
                <li>• Feeling overwhelmed regularly</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};