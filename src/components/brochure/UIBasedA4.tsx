'use client';

import React from 'react';
import A4Page from './A4Page';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription,
  MetricCard,
  Timeline,
  Button,
  Badge,
  Avatar
} from '@/components/ui';
import type { TimelineStep } from '@/components/ui/Timeline';
import { cn } from '@/lib/utils';

const UIBasedA4: React.FC = () => {
  // Sample data
  const timelineSteps: TimelineStep[] = [
    {
      id: '1',
      label: 'Project Kickoff',
      status: 'completed',
      timestamp: 'Jan 15, 2024',
      description: 'Initial project setup and team alignment'
    },
    {
      id: '2', 
      label: 'Development Phase',
      status: 'current',
      timestamp: 'Feb 1, 2024',
      description: 'Core feature development in progress'
    },
    {
      id: '3',
      label: 'Testing & QA',
      status: 'pending',
      timestamp: 'Mar 1, 2024',
      description: 'Quality assurance and user acceptance testing'
    }
  ];

  return (
    <A4Page 
      orientation="portrait" 
      margins="normal" 
      background="white"
      showPageNumber={true}
      pageNumber={1}
      className="print-colors"
    >
      {/* Print-specific styles */}
      <style jsx>{`
        .print-colors .bg-gradient-to-br {
          background: white !important;
          border: 1px solid #e5e7eb !important;
        }
        .print-colors .text-gray-100 {
          color: #1f2937 !important;
        }
        .print-colors .text-gray-300 {
          color: #374151 !important;
        }
        .print-colors .text-gray-400 {
          color: #6b7280 !important;
        }
        .print-colors .text-gray-500 {
          color: #9ca3af !important;
        }
        .print-colors .border-gray-700 {
          border-color: #e5e7eb !important;
        }
        .print-colors .bg-gray-800 {
          background-color: #f9fafb !important;
        }
        .print-colors .bg-gray-900 {
          background-color: white !important;
        }
      `}</style>

      <div className="h-full flex flex-col">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Business Report Dashboard</h1>
          <p className="text-gray-600">Comprehensive overview of key metrics and project status</p>
        </div>

        {/* Metrics Grid */}
        <div className="grid grid-cols-3 gap-4 mb-8">
          <MetricCard
            title="Revenue"
            value="$24.5M"
            change={{ value: 12.5, type: 'increase' }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
              </svg>
            }
          />
          <MetricCard
            title="Active Users"
            value="12,847"
            change={{ value: 8.3, type: 'increase' }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
              </svg>
            }
          />
          <MetricCard
            title="Success Rate"
            value="94.2%"
            change={{ value: 2.1, type: 'increase' }}
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            }
          />
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-2 gap-6 flex-1">
          {/* Project Timeline */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Project Timeline</CardTitle>
              <CardDescription>Current project milestones and progress</CardDescription>
            </CardHeader>
            <CardContent>
              <Timeline steps={timelineSteps} orientation="vertical" />
            </CardContent>
          </Card>

          {/* Team Information */}
          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Team Overview</CardTitle>
              <CardDescription>Key team members and their roles</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <Avatar name="John Doe" />
                  <div>
                    <h4 className="font-medium text-gray-100">John Doe</h4>
                    <p className="text-sm text-gray-400">Project Manager</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar name="Sarah Miller" />
                  <div>
                    <h4 className="font-medium text-gray-100">Sarah Miller</h4>
                    <p className="text-sm text-gray-400">Lead Developer</p>
                  </div>
                  <Badge variant="success">Active</Badge>
                </div>
                <div className="flex items-center gap-3">
                  <Avatar name="Tom Chen" />
                  <div>
                    <h4 className="font-medium text-gray-100">Tom Chen</h4>
                    <p className="text-sm text-gray-400">UI/UX Designer</p>
                  </div>
                  <Badge variant="waiting">Away</Badge>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Key Insights */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>Key Insights & Recommendations</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-semibold text-gray-100 mb-2">Performance Highlights</h4>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>• Revenue exceeded targets by 12.5%</li>
                    <li>• User engagement increased 8.3% month-over-month</li>
                    <li>• Customer satisfaction maintained at 94.2%</li>
                    <li>• Zero critical incidents in the past quarter</li>
                  </ul>
                </div>
                <div>
                  <h4 className="font-semibold text-gray-100 mb-2">Action Items</h4>
                  <ul className="space-y-1 text-sm text-gray-400">
                    <li>• Complete development phase by March 1st</li>
                    <li>• Begin user acceptance testing</li>
                    <li>• Prepare production deployment plan</li>
                    <li>• Schedule stakeholder review meeting</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-4 pt-4 border-t border-gray-200 text-center">
          <p className="text-sm text-gray-500">
            Generated on {new Date().toLocaleDateString()} | Confidential Business Report
          </p>
        </div>
      </div>
    </A4Page>
  );
};

export default UIBasedA4;