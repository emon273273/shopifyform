'use client';
import { useForm, Controller, useFieldArray } from 'react-hook-form';
import { DevTool } from '@hookform/devtools';
import React, { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { Card, CardTitle, CardHeader, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

//zod
const schema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string().min(1, 'Description is required'),
  media: z.any().refine((file) => file?.length > 0, 'Media is required'),
  category: z.string().nonempty('Category is required'),
  price: z.number().min(0, 'Price must be at least 0').nullable(),
  compareAtPrice: z
    .number()
    .min(0, 'Compare-at price must be at least 0')
    .nullable(),
  costPerItem: z.number().min(0, 'Cost per item must be at least 0').nullable(),
  status: z.string().nonempty('Status is required'),
  productType: z.string().min(1, 'Product type is required'),
  vendor: z.string().min(1, 'Vendor is required'),
  collections: z.string().optional(),
  tags: z.string().optional(),
  variants: z.array(
    z.object({
      optionName: z.string().min(1, 'option name is required'),
      optionValues: z.string().min(1, 'option values are required'),
    })
  ),
});

const categories = {
  'Animals & Pet Supplies': ['Pet Food', 'Pet Toys', 'Pet Accessories'],
  'Apparel & Accessories': ['Clothing', 'Shoes', 'Jewelry'],
  'Arts & Entertainment': ['Books', 'Music', 'Movies'],
  'Baby & Toddler': ['Clothing', 'Toys', 'Baby Care'],
  'Business & Industrial': ['Office Supplies', 'Industrial Equipment'],
  'Cameras & Optics': ['Cameras', 'Lenses', 'Accessories'],
  Electronics: ['Phones', 'Computers', 'TVs'],
  'Food, Beverages & Tobacco': ['Snacks', 'Beverages', 'Cigarettes'],
};

const CustomSelectItem = ({ value, label, onButtonClick }) => (
  <div className="flex justify-between items-center">
    <SelectItem value={value}>{label}</SelectItem>
    <Button onClick={() => onButtonClick(value)} variant="outline" size="icon">
      <ChevronRight className="h-4 w-4" />
    </Button>
  </div>
);

function Form() {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    mode: 'onChange',
    
  });

  const { fields, append, prepend, remove, swap, move, insert } = useFieldArray(
    {
      control,
      name: 'variants',
    }
  );
  const [selectedCategory, setSelectedCategory] = useState(null);

  const handleCategoryClick = (category) => {
    setSelectedCategory((prevCategory) =>
      prevCategory === category ? null : category
    );
  };

  const onSubmit = (data) => {
    console.log(data);
  };

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <CardTitle>Add Product</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="title"
              >
                Title
              </label>
              <Input
                id="title"
                type="text"
                placeholder="Short sleeve t-shirt"
                className="w-full"
                {...register('title')}
              />
              {errors.title && (
                <p className="text-red-500 text-xs italic">
                  {errors.title.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="description"
              >
                Description
              </label>
              <Textarea
                id="description"
                placeholder="Description"
                className="w-full"
                {...register('description')}
              />
              {errors.description && (
                <p className="text-red-500 text-xs italic">
                  {errors.description.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="media"
              >
                Media
              </label>
              <Input
                id="media"
                className="w-full"
                type="file"
                {...register('media')}
              />
              {errors.media && (
                <p className="text-red-500 text-xs italic">
                  {errors.media.message}
                </p>
              )}
            </div>

            <div>
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="category"
              >
                Catagory
              </label>
              <Controller
                name="category"
                control={control}
                render={({ field }) => (
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.entries(categories).map(
                        ([category, subcategories]) => (
                          <SelectGroup key={category}>
                            <CustomSelectItem
                              value={category}
                              label={category}
                              onButtonClick={() =>
                                handleCategoryClick(category)
                              }
                            />
                            {selectedCategory === category && (
                              <div className="pl-4">
                                {subcategories.map((subcategory) => (
                                  <SelectItem
                                    key={subcategory}
                                    value={subcategory}
                                  >
                                    {subcategory}
                                  </SelectItem>
                                ))}
                              </div>
                            )}
                          </SelectGroup>
                        )
                      )}
                    </SelectContent>
                  </Select>
                )}
              />
              {errors.category && (
                <p className="text-red-500 text-xs italic">
                  {errors.category.message}
                </p>
              )}
            </div>

            <div className="flex">
              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="price"
                >
                  Price
                </label>
                <Input
                  id="price"
                  type="number"
                  placeholder="0.00"
                  className="w-full"
                  {...register('price', {
                    valueAsNumber: true,
                  })}
                />
                {errors.price && (
                  <p className="text-red-500 text-xs italic">
                    {errors.price.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="compareAtPrice"
                >
                  Compare-at price
                </label>
                <Input
                  id="compareAtPrice"
                  type="number"
                  placeholder="0.00"
                  className="w-full"
                  {...register('compareAtPrice', {
                    valueAsNumber: true,
                  })}
                />
                {errors.compareAtPrice && (
                  <p className="text-red-500 text-xs italic">
                    {errors.compareAtPrice.message}
                  </p>
                )}
              </div>

              <div className="mb-4">
                <label
                  className="block text-gray-700 text-sm font-bold mb-2"
                  htmlFor="costPerItem"
                >
                  Cost per item
                </label>
                <Input
                  id="costPerItem"
                  type="number"
                  placeholder="0.00"
                  className="w-full"
                  {...register('costPerItem', {
                    valueAsNumber: true,
                  })}
                />
                {errors.costPerItem && (
                  <p className="text-red-500 text-xs italic">
                    {errors.costPerItem.message}
                  </p>
                )}
              </div>
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="status"
              >
                Status
              </label>
              <Controller
                name="status"
                control={control}
                render={({ field }) => (
                  <select
                    id="status"
                    className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                    {...field}
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </select>
                )}
              />
              {errors.status && (
                <p className="text-red-500 text-xs italic">
                  {errors.status.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="productType"
              >
                Product Type
              </label>
              <Input
                id="productType"
                type="text"
                placeholder="Product Type"
                className="w-full"
                {...register('productType')}
              />
              {errors.productType && (
                <p className="text-red-500 text-xs italic">
                  {errors.productType.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="vendor"
              >
                Vendor
              </label>
              <Input
                id="vendor"
                type="text"
                placeholder="Vendor"
                className="w-full"
                {...register('vendor')}
              />
              {errors.vendor && (
                <p className="text-red-500 text-xs italic">
                  {errors.vendor.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="collections"
              >
                Collections
              </label>
              <Input
                id="collections"
                type="text"
                placeholder="Collections"
                className="w-full"
                {...register('collections')}
              />
              {errors.collections && (
                <p className="text-red-500 text-xs italic">
                  {errors.collections.message}
                </p>
              )}
            </div>

            <div className="mb-4">
              <label
                className="block text-gray-700 text-sm font-bold mb-2"
                htmlFor="tags"
              >
                Tags
              </label>
              <Input
                id="tags"
                type="text"
                placeholder="Tags"
                className="w-full"
                {...register('tags')}
              />
              {errors.tags && (
                <p className="text-red-500 text-xs italic">
                  {errors.tags.message}
                </p>
              )}
            </div>
            {/* new dynamic */}

            <div className="mb-4">
  {fields.map((item, index) => (
    <div key={item.id}>
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={`variants.${index}.optionName`}
      >
        Variant Name
      </label>
      <Input
        id={`variants.${index}.optionName`}
        type="text"
        placeholder="Variant Name"
        className="w-full"
        {...register(`variants.${index}.optionName`)}
      />
      {errors.variants?.[index]?.optionName && (
        <p className="text-red-500 text-xs italic">
          {errors.variants[index].optionName.message}
        </p>
      )}

      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor={`variants.${index}.optionValues`}
      >
        Option Values
      </label>
      <Input
        id={`variants.${index}.optionValues`}
        type="text"
        placeholder="Option Values"
        className="w-full"
        {...register(`variants.${index}.optionValues`)}
      />
      {errors.variants?.[index]?.optionValues && (
        <p className="text-red-500 text-xs italic">
          {errors.variants[index].optionValues.message}
        </p>
      )}

      <Button
        type="button"
        onClick={() => remove(index)}
        variant="destructive"
        className="mt-2 mb-2"
      >
        Delete
      </Button>
    </div>
  ))}
</div>

<Button
  variant="secondary"
  type="button"
  onClick={() => append({ optionName: "", optionValues: "" })}
  className="mt-2 mb-2"
>
  Add options like size or color
</Button>
            <div className="flex items-center justify-between">
              <Button type="submit">Submit</Button>
            </div>
          </form>
          <DevTool control={control} />
        </CardContent>
      </Card>
    </div>
  );
}

export default Form;
