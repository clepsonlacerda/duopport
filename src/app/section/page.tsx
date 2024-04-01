"use client"

import Header from "../_components/header";

import { Card, CardContent, CardHeader, CardTitle } from "../_components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/app/_components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveSection } from "./_actions/save-section";
import { toast } from "sonner";
import { Input } from "../_components/ui/input";
import { CircleCheckIcon, Loader2, SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Section } from "@prisma/client";
import { PencilIcon } from "lucide-react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell
} from "@/app/_components/ui/table"
import { Button } from "@/app/_components/ui/button";

import { getFindAllSections } from "./_actions/fins-all-sections";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../_components/ui/alert-dialog";
import { DeleteSection } from "./_actions/delete-section";

const formSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: "Campo Nome obrigatório.",
  }).trim().min(1, "Campo Nome obrigatório."),
})

interface sectionProps {
  defaultValues?: z.infer<typeof formSchema>
}

const Section = () => {

  const [sections, setSections] = useState<Section[]>([]);
  const [section, setSection] = useState<Section>({ id: '', name: '' });
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isSectionsLoading, setIsSectionsLoading] = useState(false);

  useEffect(() => {
    const findAllSections = async () => {
      try {
        setIsSectionsLoading(true);

        const listSections = await getFindAllSections();

        setSections(listSections);
      } catch (error) {
        // error
      } finally {
        setIsSectionsLoading(false)
      }
    }

    findAllSections();
  }, [section]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: section,
    values: section,
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitIsLoading(true);

    const { name, id } = values;

    try {

      await SaveSection({
        id,
        name,
      });

      toast.success("Seção salva com sucesso!", {
        icon: <CircleCheckIcon size={16} className="text-green-500" />
      });

      form.reset();
      setSection({ id: '', name: '' });
    } catch (error) {
    } finally {
      setSubmitIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleteLoading(true);

    try {
      await DeleteSection(id);

      setSections((state) => state.filter((item) => item.id != id))

      toast("Seção excluída com sucesso!", {
        icon: <CircleCheckIcon size={16} className="text-green-500" />
      });
    } catch (error) {

    } finally {
      setIsDeleteLoading(false);
    }
  }

  return (
    <section>
      <Header />

      <div className="container mt-8">
        <Card>
          <CardHeader>
            <CardTitle className="text-base" >Cadastre uma Seção</CardTitle>
          </CardHeader>
          <CardContent >
            <Form {...form}>
              <form className="flex gap-4" onSubmit={form.handleSubmit(handleSubmit)}>
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Nome da seção" {...field} autoComplete="off" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <Button variant="default" type="submit" disabled={submitIsLoading} >
                  {submitIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <SaveIcon size={20} className="mr-2" /> Salvar
                </Button>
              </form>
            </Form>
          </CardContent>
        </Card>

        <Card className="mt-8">
          <CardHeader>
            <CardTitle className="text-base" >
              Lista de seções cadastradas
            </CardTitle>
          </CardHeader>
          <CardContent >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
                {sections.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="text-right">
                      <AlertDialog >
                        <AlertDialogTrigger asChild>
                          <Button className="rounded-full mr-1" variant="destructive" >
                            <TrashIcon size={16} />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="w-[90%] rounded-sm">
                          <AlertDialogHeader>
                            <AlertDialogTitle>Deseja mesmo apagar essa seção?</AlertDialogTitle>
                            <AlertDialogDescription>
                              Uma vez apagado, não será possível reverter essa ação.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter className="flex-row gap-3">
                            <AlertDialogCancel className="w-full mt-0">Cancelar</AlertDialogCancel>
                            <AlertDialogAction
                              disabled={isDeleteLoading}
                              className="w-full"
                              onClick={() => handleDelete(item.id)}
                            >
                              {isDeleteLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                              Confirmar
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                      <Button className="rounded-full" onClick={() => setSection(item)}>
                        <PencilIcon size={16} />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}

              </TableBody>
            </Table>
          </CardContent>
        </Card>

      </div>
    </section>
  );
}

export default Section;