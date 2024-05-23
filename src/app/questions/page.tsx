"use client"

import Header from "../_components/header";

import { Button } from "@/app/_components/ui/button";
import { Form, FormControl, FormField, FormItem, FormMessage } from "@/app/_components/ui/form";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/app/_components/ui/table";
import { zodResolver } from "@hookform/resolvers/zod";
import { CircleCheckIcon, Loader2, PencilIcon, PlusCircle, SaveIcon, TrashIcon, XIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { z } from "zod";
import { Card, CardContent, CardHeader, CardTitle } from "../_components/ui/card";
import { Input } from "../_components/ui/input";

import { Answer, Prisma, Unit } from "@prisma/client";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "../_components/ui/alert-dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../_components/ui/select";
import { getFindAllUnits } from "../unit/_actions/fins-all-units";
import { DeleteQuestion } from "./_actions/delete-unit";
import { getFindAllQuestions } from "./_actions/fins-all-questions";
import { saveAnswer } from "./_actions/save-answer";
import { SaveQuestion } from "./_actions/save-question";
import { DeleteAnswer } from "./_actions/delete-answer";

const formSchema = z.object({
  id: z.string(),
  question: z.string({
    required_error: "Campo Questão obrigatório.",
  }).trim().min(1, "Campo Questão obrigatório."),
  correct: z.boolean(),
  date: z.date(),
  unitId: z.string(),
  answers: z.array(
    z.object({
      id: z.string(),
      name: z.string(),
      questionId: z.string(),
    })
  ),
});

const defaultQuestion: QuestionProps = {
  id: '',
  question: '',
  correct: false,
  date: new Date(),
  unitId: '',
  answers: [],
  unit: {
    description: '',
    id: '',
    name: '',
    sectionId: '',
  },
};

interface QuestionProps extends Prisma.QuestionGetPayload<{ include: { answers: true, unit: true } }> {
}

const PageQuestion = () => {

  const [questions, setQuestions] = useState<QuestionProps[]>([]);
  const [units, setUnits] = useState<Unit[]>([]);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [answer, setAnswer] = useState<Answer>({ id: '', name: '', questionId: '' });
  const [question, setQuestion] = useState<QuestionProps>(defaultQuestion);

  const [submitIsLoading, setSubmitIsLoading] = useState(false);
  const [isDeleteLoading, setIsDeleteLoading] = useState(false);
  const [isUnitsLoading, setIsUnitsLoading] = useState(false);

  useEffect(() => {
    const findAllUnits = async () => {
      try {

        const listUnits = await getFindAllUnits();
        const listQuestions = await getFindAllQuestions();

        setUnits(listUnits);
        setQuestions(listQuestions);
      } catch (error) {
        console.log(error);
      } finally {
      }
    }

    findAllUnits();
  }, [question]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: question,
    values: question,
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    setSubmitIsLoading(true);

    const { question, id, correct, date, unitId } = values;

    try {

      if (answers.length === 0) {
        toast.success("Adicione um resposta!");
        return;
      }

      const questionCreated = await SaveQuestion({
        id,
        question,
        unitId,
        correct,
        date,
      });

      if (!id) {
        answers.map(item => {
          saveAnswer({
            name: item.name,
            questionId: questionCreated.id,
          });
        })
      }

      toast.success("Unidade salva com sucesso!", {
        icon: <CircleCheckIcon size={16} className="text-green-500" />
      });

      form.reset();

      setQuestion(defaultQuestion);
      setAnswers([]);

    } catch (error) {
    } finally {
      setSubmitIsLoading(false);
    }
  }

  const handleDelete = async (id: string) => {
    setIsDeleteLoading(true);

    try {
      await DeleteQuestion(id);

      setQuestions((state) => state.filter((item) => item.id != id))

      toast("Questão excluída com sucesso!", {
        icon: <CircleCheckIcon size={16} className="text-green-500" />
      });
    } catch (error) {

    } finally {
      setIsDeleteLoading(false);
    }
  }

  const handleEdit = async (item: QuestionProps) => {
    setQuestion(item);

    setAnswers(item.answers);
  }

  const handleAddAnswer = () => {

    if (!answer.name) {
      toast("Informe uma resposta");

      return;
    }

    if (answers.find(item => item.name.toUpperCase().trim() === answer.name.toUpperCase().trim())) {
      toast("Resposta já adicionada");

      return;
    }

    console.log(answer);

    setAnswers(prevState => [...prevState, answer])

    setAnswer({ id: '', name: '', questionId: '' });

  }

  const handleDeleteAnswer = async (name: string, id: string) => {
    setAnswers((state) => state.filter((item) => item.name != name));

    if (id) {
      await DeleteAnswer(id);
    }
  }

  const handleCancel = () => {
    form.reset();

    setQuestion(defaultQuestion);
    setAnswers([]);
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
              <form onSubmit={form.handleSubmit(handleSubmit)}>

                <div className="flex flex-col md:flex-row gap-4">

                  <FormField
                    control={form.control}
                    name="question"
                    render={({ field }) => (
                      <FormItem className="w-full">
                        <FormControl>
                          <Input placeholder="Questão" {...field} autoComplete="off" />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="unitId"
                    render={({ field }) => (
                      <FormItem className="w-full" >
                        <Select onValueChange={field.onChange} defaultValue={field.value} {...field}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecione uma unidade" {...field} />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {units.map((item) => (
                              <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>

                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <div className="flex gap-4 w-full">
                    <Input
                      placeholder="Resposta"

                      value={answer.name}
                      onChange={(e) => setAnswer(prevState => ({ ...prevState, name: e.target.value }))}
                    />

                    <Button type="button" onClick={handleAddAnswer} >
                      <PlusCircle size={20} />
                    </Button>
                  </div>

                </div>

                {answers.length > 0 && (
                  <div className="mt-4 bg-zinc-50 p-4 rounded-sm border border-zinc-100">
                    <h6 className="font-semibold">Respostas adicionadas</h6>
                    {answers.map((items, i) => (
                      <div key={i} className="flex items-center gap-4">
                        <div>
                          <Button type="button" className="bg-transparent hover:bg-transparent p-0 m-0"
                            onClick={() => handleDeleteAnswer(items.name, items?.id)}
                          >
                            <TrashIcon className="text-red-600" size={17} />
                          </Button>
                        </div>
                        <div>
                          {items.name}
                        </div>
                      </div>
                    ))}
                  </div>
                )}

                <Button variant="default" type="submit" disabled={submitIsLoading} className="mt-4" >
                  {submitIsLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                  <SaveIcon size={20} className="mr-2" /> Salvar
                </Button>

                {question.id && (
                  <Button className="ml-2" type="button" variant="outline" onClick={handleCancel}>
                    <XIcon size={20} className="mr-2" /> Cancelar
                  </Button>
                )}
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
                  <TableHead>Questão</TableHead>
                  <TableHead>Unidade</TableHead>
                  <TableHead className="text-right"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody >
                {questions.map((item) => (
                  <TableRow key={item.id}>
                    <TableCell className="font-medium">{item.question}</TableCell>
                    <TableCell className="font-medium">{item.unit.name}</TableCell>
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
                      <Button className="rounded-full" onClick={() => handleEdit(item)}>
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

export default PageQuestion;