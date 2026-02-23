import { DocumentCard } from "@/components/documents/DocumentCard";
import { documentsService } from "@/services";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

const Documents = () => {
  const queryClient = useQueryClient();

  const { data: documents, isLoading, error } = useQuery({
    queryKey: ['documents'],
    queryFn: documentsService.getMyDocuments,
  });

  const { mutate: createDocument } = useMutation({
    mutationFn: documentsService.create,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['documents'] });
    },
  });

  return (
    <div className="grid gap-4">
      {documents?.map((doc) => (
        <DocumentCard
          key={doc.id}
          title={doc.title}
          excerpt={doc.content?.slice(0, 100) || ""}
          size={`${doc.stats.downloads} downloads`}
          date={new Date(doc.createdAt).toLocaleDateString()}
          tags={doc.tags}
        />
      ))}
    </div>
  );
};
export default Documents;