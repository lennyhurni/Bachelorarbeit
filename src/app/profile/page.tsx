"use client"

export const dynamic = 'force-dynamic'

import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Link from "next/link"
import { ArrowRight, Mail, MessageSquare, Edit, FileText, Award, Sparkles, BookOpen, User, CheckCircle2 } from "lucide-react"
import RequireAuth from "@/components/RequireAuth"

export default function ProfilePage() {
  return (
    <RequireAuth>
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left column - Personal info */}
          <div className="lg:col-span-1 space-y-6">
            <div className="p-6 bg-card rounded-xl border shadow-sm flex flex-col items-center">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src="/avatar.png" alt="Profile picture" />
                <AvatarFallback>JS</AvatarFallback>
              </Avatar>
              <h2 className="text-xl font-semibold mb-1">John Smith</h2>
              <p className="text-muted-foreground text-sm mb-4">Software Engineer</p>
              <div className="flex space-x-2 mb-4">
                <Button variant="outline" size="sm" className="gap-1">
                  <Edit className="h-4 w-4" />
                  Edit
                </Button>
                <Button variant="outline" size="sm" className="gap-1">
                  <Mail className="h-4 w-4" />
                  Contact
                </Button>
              </div>
              <div className="w-full pt-4 border-t flex flex-col gap-3">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Member since</span>
                  <span>Jan 2023</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Reflections</span>
                  <span>24</span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Last active</span>
                  <span>Today</span>
                </div>
              </div>
            </div>
            
            <Card>
              <CardHeader>
                <CardTitle>Skills & Interests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                <div className="flex flex-wrap gap-2">
                  <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm">JavaScript</div>
                  <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm">React</div>
                  <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm">UX Design</div>
                  <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm">Agile</div>
                  <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm">Leadership</div>
                  <div className="px-3 py-1.5 bg-primary/10 text-primary rounded-lg text-sm">Problem Solving</div>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Achievements</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3">
                  <div className="bg-amber-100 dark:bg-amber-900 p-2 rounded-lg">
                    <Award className="h-5 w-5 text-amber-600 dark:text-amber-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Reflection Master</h3>
                    <p className="text-xs text-muted-foreground">Completed 20+ reflections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-green-100 dark:bg-green-900 p-2 rounded-lg">
                    <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Critical Thinker</h3>
                    <p className="text-xs text-muted-foreground">5 critical level reflections</p>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <div className="bg-blue-100 dark:bg-blue-900 p-2 rounded-lg">
                    <Sparkles className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <h3 className="text-sm font-medium">Growth Mindset</h3>
                    <p className="text-xs text-muted-foreground">Consistent improvement in reflection depth</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
          
          {/* Middle column - Profile details */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Personal Information</CardTitle>
                <CardDescription>Update your personal details</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First name</Label>
                    <Input id="firstName" defaultValue="John" />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last name</Label>
                    <Input id="lastName" defaultValue="Smith" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input id="email" type="email" defaultValue="john.smith@example.com" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="role">Role/Position</Label>
                  <Input id="role" defaultValue="Software Engineer" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea 
                    id="bio" 
                    rows={4} 
                    placeholder="Tell us about yourself"
                    defaultValue="Passionate software engineer with 5 years of experience in web development. I enjoy solving complex problems and learning new technologies."
                  />
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Save Changes</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Reflection Preferences</CardTitle>
                <CardDescription>Customize your reflection experience</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>Preferred reflection level</Label>
                  <RadioGroup defaultValue="analytical" className="flex flex-col space-y-1">
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="descriptive" id="descriptive" />
                      <Label htmlFor="descriptive" className="font-normal">Descriptive</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="analytical" id="analytical" />
                      <Label htmlFor="analytical" className="font-normal">Analytical</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem value="critical" id="critical" />
                      <Label htmlFor="critical" className="font-normal">Critical</Label>
                    </div>
                  </RadioGroup>
                </div>
                
                <div className="space-y-2">
                  <Label>Favorite reflection categories</Label>
                  <div className="grid grid-cols-2 gap-2">
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="work" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" defaultChecked />
                      <Label htmlFor="work" className="font-normal">Work Projects</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="learning" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" defaultChecked />
                      <Label htmlFor="learning" className="font-normal">Learning</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="collaboration" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                      <Label htmlFor="collaboration" className="font-normal">Collaboration</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <input type="checkbox" id="personal" className="form-checkbox h-4 w-4 text-primary rounded border-gray-300 focus:ring-primary" />
                      <Label htmlFor="personal" className="font-normal">Personal Growth</Label>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter className="flex justify-end">
                <Button>Update Preferences</Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Recent Activity</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="border rounded-lg divide-y">
                  <div className="p-3 flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">Project Retrospective</h3>
                        <span className="text-xs text-muted-foreground">2 days ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Created a new analytical reflection</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">Learning Journey</h3>
                        <span className="text-xs text-muted-foreground">1 week ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Updated a critical reflection</p>
                    </div>
                  </div>
                  <div className="p-3 flex items-start gap-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex justify-between">
                        <h3 className="text-sm font-medium">Profile</h3>
                        <span className="text-xs text-muted-foreground">2 weeks ago</span>
                      </div>
                      <p className="text-xs text-muted-foreground">Updated personal information</p>
                    </div>
                  </div>
                </div>
              </CardContent>
              <CardFooter>
                <Button variant="outline" className="w-full gap-1">
                  View All Activity
                  <ArrowRight className="h-4 w-4" />
                </Button>
              </CardFooter>
            </Card>
          </div>
        </div>
      </div>
    </RequireAuth>
  )
} 