"use client"

import Header from "../_components/header";

import { Card, CardContent, CardHeader, CardTitle } from "../_components/ui/card";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/app/_components/ui/form";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { SaveUnit } from "./_actions/save-unit";
import { toast } from "sonner";
import { Input } from "../_components/ui/input";
import { CircleCheckIcon, Loader2, SaveIcon, TrashIcon } from "lucide-react";
import { useEffect, useState } from "react";
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

import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../_components/ui/alert-dialog";
import { DeleteUnit } from "./_actions/delete-unit";
import { getFindAllUnits } from "./_actions/fins-all-units";
import { Prisma, Section, Unit } from "@prisma/client";
import { getFindAllSections } from "../section/_actions/fins-all-sections";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";

const formSchema = z.object({
  id: z.string(),
  name: z.string({
    required_error: "Campo Nome obrigatório.",
  }).trim().min(1, "Campo Nome obrigatório."),
  description: z.string({
    required_error: "Campo Descrição obrigatório.",
  }).trim().min(1, "Campo Descrição obrigatório."),
  sectionId: z.string(),
})

interface unitProps {
  defaultValues?: z.infer<typeof formSchema>
}

const Unit = () => {

  const [sections, setSections] = useState<Section[]>([]);
  const [units, setUnits] = useState<Prisma.UnitGetPayload<{ include: { barbershop: true } }>[]>([]);
  const [unit, setUnit] = useState<Unit>({ id: '', name: '', description: '', sectionId: '' });
  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isUnitsLoading, setIsUnitsLoading] = useState(false);

  useEffect(() => {
    const findAllUnits = async () => {
      try {
        setIsUnitsLoading(true);

        const listUnits = await getFindAllUnits();
        const listSections = await getFindAllSections();

        console.log('--', listSections);


        setUnits(listUnits);
        setSections(listSections);
      } catch (error) {
        console.log(error);

      } finally {
        setIsUnitsLoading(false)
      }
    }

    findAllUnits();
  }, [unit]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: unit,
    values: unit,
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitIsLoading(true);

    const { name, id, description, sectionId } = values;

    try {

      await SaveUnit({
        id,
        name,
        description,
        sectionId,
      });

      toast.success("Unidade salva com sucesso!", {
        icon: <CircleCheckIcon size={16} className="text-green-500" />
      });

      form.reset();
      setUnit({ id: '', name: '', description: '', sectionId: '' });
    } catch (error) {
    } finally {
      setSubmitIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleteLoading(true);

    try {
      await DeleteUnit(id);

      setUnits((state) => state.filter((item) => item.id != id))

      toast("Unidade excluída com sucesso!", {
        icon: <CircleCheckIcon size={16} className="text-green-500" />
      });
    } catch (error) {

    } finally {
      setIsDeleteLoading(false);
    }
  }

  async function getNameSection(id: string) {
    return await getNameSection(id);
  }

  return (
    <section>
      <Header />

      <div className="container mt-8">
        <Card className="shadow-md">
          <CardHeader>
            <CardTitle className="text-base" >Cadastre uma Unidade</CardTitle>
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
                        <Input placeholder="Nome da unidade" {...field} autoComplete="off" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input placeholder="Descrição da unidade" {...field} autoComplete="off" />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="sectionId"
                  render={({ field }) => (
                    <FormItem>
                      <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecione uma seção" {...field} />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {sections.map((item) => (
                            <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

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

        <Card className="mt-8 shadow-md">
          <CardHeader>
            <CardTitle className="text-base" >
              Lista de unidades cadastradas
            </CardTitle>
          </CardHeader>
          <CardContent >
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nome</TableHead>
                  <TableHead>Descrição</TableHead>
                  <TableHead>Seção</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
                {units.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.name}</TableCell>
                    <TableCell className="font-medium">{item.description}</TableCell>
                    <TableCell className="font-medium">{item.barbershop.name}</TableCell>
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
                      <Button className="rounded-full" onClick={() => setUnit(item)}>
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

export default Unit;