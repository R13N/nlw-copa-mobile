import { useState } from "react";
import { Heading, VStack, useToast } from "native-base";
import { Header } from "../components/Header";
import { useNavigation } from "@react-navigation/native";

import { Input } from "../components/Input";
import { Button } from "../components/Button";
import { api } from "../services/api";

export function Find() {

  const [isLoading, setIsLoading] = useState(false);
  const [code, setCode] = useState('');
  const { navigate } = useNavigation();

  const toast = useToast();

  async function handleJoinPool() {
    try {
      setIsLoading(true);

      if (!code.trim()) {
        return toast.show({
          title: "Informe o código!",
          placement: "top",
          bgColor: "red.500"
        })
      }

      const response = await api.post('/pools/join', { code });

      toast.show({
        title: "Você entrou no bolão com sucesso!",
        placement: "top",
        bgColor: "green.500"
      })

      navigate('pools')
      console.log(response.data);


    } catch (error) {
      console.log(error);
      setIsLoading(false);

      if (error.response?.data?.message === "Pool not found!") {
        setCode('')
        return toast.show({
          title: "Bolão não encontrado!",
          placement: "top",
          bgColor: "red.500"
        })
      }

      if (error.response?.data?.message === "You've joined this pool!") {
        setCode('')
        return toast.show({
          title: "Você já faz parte deste bolão!",
          placement: "top",
          bgColor: "red.500"
        })
      }

      toast.show({
        title: "Não foi possível encontrar o bolão!",
        placement: "top",
        bgColor: "red.500"
      })

      setCode('')

    }
  }

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Buscar por código" showBackButton />

      <VStack mt={8} mx={5} alignItems="center">
        <Heading fontFamily="heading" color="white" fontSize="xl" mb={8} textAlign="center" >
          Encontre um bolão através de seu código único
        </Heading>

        <Input
          mb={2}
          placeholder="Qual nome do seu bolão?"
          autoCapitalize="characters"
          onChangeText={setCode}
          value={code}
        />

        <Button
          title="BUSCAR BOLÃO"
          isLoading={isLoading}
          onPress={handleJoinPool}
        />

      </VStack>
    </VStack>
  )
}