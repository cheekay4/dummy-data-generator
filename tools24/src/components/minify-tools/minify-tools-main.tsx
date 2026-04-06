'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import HtmlMinifyTab from './html-minify-tab';
import CssMinifyTab from './css-minify-tab';
import JsMinifyTab from './js-minify-tab';
import BatchDropzone from './batch-dropzone';

export default function MinifyToolsMain() {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="html">
        <TabsList>
          <TabsTrigger value="html">HTML</TabsTrigger>
          <TabsTrigger value="css">CSS</TabsTrigger>
          <TabsTrigger value="js">JavaScript</TabsTrigger>
        </TabsList>
        <TabsContent value="html" className="mt-6">
          <HtmlMinifyTab />
        </TabsContent>
        <TabsContent value="css" className="mt-6">
          <CssMinifyTab />
        </TabsContent>
        <TabsContent value="js" className="mt-6">
          <JsMinifyTab />
        </TabsContent>
      </Tabs>

      <BatchDropzone />
    </div>
  );
}
