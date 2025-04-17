'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { z } from 'zod';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, X, Plus } from 'lucide-react';
import { Separator } from '@/components/ui/separator';
import Link from 'next/link';

const formSchema = z.object({
  title: z.string().min(5, { message: 'Title must be at least 5 characters' }).max(100, { message: 'Title must be less than 100 characters' }),
  description: z.string().min(20, { message: 'Description must be at least 20 characters' }),
  type: z.string({ required_error: 'Please select a property type' }),
  price: z.string().min(1, { message: 'Please enter a price' }),
  address: z.string().min(5, { message: 'Please enter a complete address' }),
  bedrooms: z.string().min(1, { message: 'Please enter number of bedrooms' }),
  bathrooms: z.string().min(1, { message: 'Please enter number of bathrooms' }),
  area: z.string().min(1, { message: 'Please enter the area in sq.ft' }),
  images: z.array(z.string()).optional(),
});

export default function CreatePropertyPage() {
  const router = useRouter();
  const [features, setFeatures] = useState<string[]>([]);
  const [featureInput, setFeatureInput] = useState('');
  const [imageUrls, setImageUrls] = useState<string[]>([]);
  const [imageUrlInput, setImageUrlInput] = useState('');

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      title: '',
      description: '',
      type: '',
      price: '',
      address: '',
      bedrooms: '',
      bathrooms: '',
      area: '',
      images: [],
    },
  });

  const addFeature = () => {
    if (featureInput.trim() && !features.includes(featureInput.trim())) {
      setFeatures([...features, featureInput.trim()]);
      setFeatureInput('');
    }
  };

  const removeFeature = (featureToRemove: string) => {
    setFeatures(features.filter((feature) => feature !== featureToRemove));
  };

  const addImageUrl = () => {
    if (imageUrlInput.trim() && !imageUrls.includes(imageUrlInput.trim())) {
      setImageUrls([...imageUrls, imageUrlInput.trim()]);
      setImageUrlInput('');
    }
  };

  const removeImageUrl = (urlToRemove: string) => {
    setImageUrls(imageUrls.filter((url) => url !== urlToRemove));
  };

  const onSubmit = (values: z.infer<typeof formSchema>) => {
    // In a real app, you would send this data to your API
    console.log({ ...values, features, images: imageUrls });
    
    // Navigate back to housing page
    router.push('/housing');
  };

  return (
    <div className="container py-8">
      <Button variant="ghost" className="mb-4" asChild>
        <Link href="/housing">
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Link>
      </Button>

      <Card>
        <CardHeader>
          <CardTitle>Create a New Property Listing</CardTitle>
          <CardDescription>
            List your property for rent or sale
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Property Title</FormLabel>
                    <FormControl>
                      <Input placeholder="Enter a descriptive title" {...field} />
                    </FormControl>
                    <FormDescription>
                      Make it clear and specific
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="description"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Description</FormLabel>
                    <FormControl>
                      <Textarea
                        placeholder="Describe your property, its condition, amenities, etc."
                        className="min-h-[150px]"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-2">
                <FormField
                  control={form.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Property Type</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select property type" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="apartment">Apartment</SelectItem>
                          <SelectItem value="house">House</SelectItem>
                          <SelectItem value="room">Room</SelectItem>
                          <SelectItem value="office">Office Space</SelectItem>
                          <SelectItem value="commercial">Commercial Space</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="price"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Monthly Rent (৳)</FormLabel>
                      <FormControl>
                        <Input type="number" placeholder="e.g. 25000" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <FormField
                control={form.control}
                name="address"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Address</FormLabel>
                    <FormControl>
                      <Input placeholder="Full address of the property" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <div className="grid gap-6 md:grid-cols-3">
                <FormField
                  control={form.control}
                  name="bedrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bedrooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="bathrooms"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bathrooms</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="area"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Area (sq.ft)</FormLabel>
                      <FormControl>
                        <Input type="number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div>
                <FormLabel>Features</FormLabel>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add features (e.g. furnished, parking)"
                    value={featureInput}
                    onChange={(e) => setFeatureInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addFeature();
                      }
                    }}
                  />
                  <Button type="button" onClick={addFeature}>
                    Add
                  </Button>
                </div>
                <FormDescription>
                  Add features that make your property stand out
                </FormDescription>
                {features.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-2">
                    {features.map((feature) => (
                      <Badge key={feature} variant="secondary" className="gap-1">
                        {feature}
                        <button
                          type="button"
                          onClick={() => removeFeature(feature)}
                          className="ml-1 rounded-full hover:bg-muted"
                        >
                          <X className="h-3 w-3" />
                          <span className="sr-only">Remove feature</span>
                        </button>
                      </Badge>
                    ))}
                  </div>
                )}
              </div>

              <div>
                <FormLabel>Images</FormLabel>
                <div className="flex items-center gap-2">
                  <Input
                    placeholder="Add image URL"
                    value={imageUrlInput}
                    onChange={(e) => setImageUrlInput(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        addImageUrl();
                      }
                    }}
                  />
                  <Button type="button" onClick={addImageUrl}>
                    Add
                  </Button>
                </div>
                <FormDescription>
                  Add URLs of images for your property (in a real app, you would upload images)
                </FormDescription>
                {imageUrls.length > 0 && (
                  <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                    {imageUrls.map((url) => (
                      <div key={url} className="relative rounded-md border">
                        <img
                          src={url}
                          alt="Property"
                          className="h-40 w-full rounded-md object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).src = 'https://via.placeholder.com/300x200?text=Invalid+Image+URL';
                          }}
                        />
                        <button
                          type="button"
                          onClick={() => removeImageUrl(url)}
                          className="absolute right-2 top-2 rounded-full bg-background p-1 shadow-sm hover:bg-muted"
                        >
                          <X className="h-4 w-4" />
                          <span className="sr-only">Remove image</span>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Separator />

              <div className="flex justify-between">
                <Button type="button" variant="outline" onClick={() => router.back()}>
                  Cancel
                </Button>
                <Button type="submit">Create Listing</Button>
              </div>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
}
