import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Folder, Upload, Download, Trash2, File as FileIcon, Search, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useToast } from "@/hooks/use-toast";
import { filesService, type File as FileData } from "@/services/files";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";

const Files = () => {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [search, setSearch] = useState("");
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [uploadFile, setUploadFile] = useState<globalThis.File | null>(null);
  
  const { data: files = [], isLoading } = useQuery<FileData[]>({
    queryKey: ["files"],
    queryFn: filesService.getAll,
  });

  const uploadMutation = useMutation({
    mutationFn: (f: globalThis.File) => filesService.upload({ file: f as any }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      setIsUploadOpen(false);
      setUploadFile(null);
      toast({ title: "Success", description: "File uploaded successfully" });
    },
    onError: (err: any) => {
      toast({ 
        title: "Error", 
        description: err.response?.data?.message || "Failed to upload file",
        variant: "destructive"
      });
    }
  });

  const deleteMutation = useMutation({
    mutationFn: filesService.delete,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["files"] });
      toast({ title: "Success", description: "File deleted successfully" });
    },
    onError: () => {
      toast({ title: "Error", description: "Failed to delete file", variant: "destructive" });
    }
  });

  const handleDownload = async (fileId: string, fileName: string) => {
    try {
      await filesService.downloadFile(fileId, fileName);
    } catch {
      toast({ title: "Error", description: "Failed to download file", variant: "destructive" });
    }
  };

  const filteredFiles = files.filter((f: FileData) => 
    f.originalName.toLowerCase().includes(search.toLowerCase()) ||
    f.mimeType.toLowerCase().includes(search.toLowerCase())
  );

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className="mx-auto max-w-6xl space-y-6 animate-fade-in">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">Files</h1>
          <p className="text-muted-foreground mt-1">Manage all your uploaded documents and assets</p>
        </div>
        <Button 
          onClick={() => setIsUploadOpen(true)}
          className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white hover:opacity-90"
        >
          <Upload className="h-4 w-4 mr-2" /> Upload File
        </Button>
      </div>

      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          placeholder="Search files..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="rounded-xl pl-9"
        />
      </div>

      {isLoading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Array.from({ length: 6 }).map((_, i) => (
            <Card key={i} className="rounded-2xl border-border bg-card/80">
              <CardContent className="p-5 flex items-center gap-4">
                <Skeleton className="h-10 w-10 rounded-xl" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-3/4" />
                  <Skeleton className="h-3 w-1/2" />
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : filteredFiles.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-muted/20 rounded-3xl border-2 border-dashed border-muted">
          <Folder className="h-12 w-12 text-muted-foreground mb-4" />
          <h2 className="text-xl font-semibold">No files found</h2>
          <p className="text-muted-foreground">Upload a file to get started</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filteredFiles.map((file) => (
            <Card key={file.id} className="rounded-2xl border-border bg-card/80 backdrop-blur-sm hover:shadow-lg transition-all duration-200 group">
              <CardContent className="p-5">
                <div className="flex items-start justify-between">
                  <div className="flex items-center gap-4 min-w-0">
                    <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary shrink-0">
                      <FileIcon className="h-5 w-5" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-semibold text-sm truncate">{file.originalName}</h3>
                      <p className="text-xs text-muted-foreground">{formatSize(file.size)} • {file.mimeType.split('/')[1].toUpperCase()}</p>
                    </div>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8 rounded-full">
                        <MoreVertical className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end" className="rounded-xl">
                      <DropdownMenuItem onClick={() => handleDownload(file.id, file.originalName)} className="gap-2">
                        <Download className="h-4 w-4" /> Download
                      </DropdownMenuItem>
                      <DropdownMenuItem 
                        onClick={() => deleteMutation.mutate(file.id)}
                        className="gap-2 text-destructive focus:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" /> Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <div className="mt-4 flex items-center justify-between text-[10px] text-muted-foreground uppercase tracking-wider font-medium">
                  <span>Uploaded {new Date(file.createdAt).toLocaleDateString()}</span>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* Upload Dialog */}
      <Dialog open={isUploadOpen} onOpenChange={setIsUploadOpen}>
        <DialogContent className="sm:max-w-[425px] rounded-3xl">
          <DialogHeader>
            <DialogTitle>Upload File</DialogTitle>
            <DialogDescription>
              Select a file to upload to your hub. Max size 10MB.
            </DialogDescription>
          </DialogHeader>
          <div className="py-6">
            <div 
              className="border-2 border-dashed border-muted rounded-2xl p-10 text-center hover:bg-muted/30 transition-all cursor-pointer group"
              onClick={() => document.getElementById('file-upload-main')?.click()}
            >
              <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4 text-primary group-hover:scale-110 transition-transform">
                <Upload className="h-6 w-6" />
              </div>
              <p className="text-sm font-medium">{uploadFile ? uploadFile.name : "Click to select file"}</p>
              <p className="text-xs text-muted-foreground mt-1">PDF, Images, TXT, etc.</p>
              <input 
                id="file-upload-main" 
                type="file" 
                className="hidden" 
                onChange={(e) => setUploadFile(e.target.files?.[0] || null)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="ghost" onClick={() => setIsUploadOpen(false)} className="rounded-xl">Cancel</Button>
            <Button 
              onClick={() => uploadFile && uploadMutation.mutate(uploadFile)}
              disabled={!uploadFile || uploadMutation.isPending}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-600 text-white"
            >
              {uploadMutation.isPending ? "Uploading..." : "Upload"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Files;
