import { ViewIcon, ViewOffIcon } from "@chakra-ui/icons"
import {
  Button,
  Container,
  FormControl,
  FormErrorMessage,
  Icon,
  Input,
  InputGroup,
  InputRightElement,
  Link,
  Text,
  Box,
  useBoolean,
  keyframes,
  Image,
} from "@chakra-ui/react"
import {
  Link as RouterLink,
  createFileRoute,
  redirect,
} from "@tanstack/react-router"
import { type SubmitHandler, useForm } from "react-hook-form"

import type { Body_login_login_access_token as AccessToken } from "../client"
import useAuth, { isLoggedIn } from "../hooks/useAuth"
import { emailPattern } from "../utils"

export const Route = createFileRoute("/login")({
  component: Login,
  beforeLoad: async () => {
    if (isLoggedIn()) {
      throw redirect({
        to: "/",
      })
    }
  },
})

// Анимация для плавного появления
const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(-20px); }
  to { opacity: 1; transform: translateY(0); }
`

function Login() {
  const [show, setShow] = useBoolean()
  const { loginMutation, error, resetError } = useAuth()
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<AccessToken>({
    mode: "onBlur",
    criteriaMode: "all",
    defaultValues: {
      username: "",
      password: "",
    },
  })

  const onSubmit: SubmitHandler<AccessToken> = async (data) => {
    if (isSubmitting) return

    resetError()

    try {
      await loginMutation.mutateAsync(data)
    } catch {
      // Обработка ошибки происходит в хуке useAuth
    }
  }

  return (
    <Box bg="#212E30" minH="100vh" display="flex" alignItems="center" justifyContent="center">
      {/* Надпись PizzaFlow слева сверху */}
      <Text
        position="absolute"
        top="20px"
        left="20px"
        fontSize="4xl"
        fontWeight="black"
        color="white"
        fontFamily="X5 Sans"
        textShadow="2px 2px 4px rgba(0, 0, 0, 0.5)"
      >
        <Text as="span" color="#FFFFFF">
          Pizza
        </Text>
        <Text as="span" color="#FF5234">
          Flow
        </Text>
      </Text>

      <Container
        as="form"
        onSubmit={handleSubmit(onSubmit)}
        maxW="md"
        bg="white"
        p={8}
        borderRadius="xl"
        boxShadow="xl"
        animation={`${fadeIn} 0.5s ease-in-out`}
        position="relative"
      >
        {/* Логотип над окном */}
        <Image
          src="/assets/images/logo.png" 
          alt="Logo"
          width="100px"
          height="auto"
          position="absolute"
          top="-150px"
          left="50%"
          transform="translateX(-50%)"
          borderRadius="full"
          boxShadow="xl"
        />

        <Box mb={8} textAlign="center">
          <Text fontSize="2xl" fontWeight="bold" mb={2} fontFamily="X5 Sans">
            Добро пожаловать
          </Text>
          <Text
            fontSize="5xl"
            fontWeight="medium"
            fontFamily="X5 Sans"

          >
            <Text as="span" color="#000000">
              Pizza
            </Text>
            <Text as="span" color="#FF5234">
              Flow
            </Text>
          </Text>
        </Box>

        <FormControl id="username" isInvalid={!!errors.username || !!error} mb={4}>
          <Input
            {...register("username", {
              required: "Username is required",
              pattern: emailPattern,
            })}
            placeholder="Почта"
            type="email"
            required
            focusBorderColor="#FF5234"
            borderColor="#FF5234"
            borderRadius="15px"
            h="50px"
            fontFamily="X5 Sans"
            _hover={{ borderColor: "#FF391A" }}
            transition="border-color 0.2s ease-in-out"
          />
          {errors.username && (
            <FormErrorMessage fontFamily="X5 Sans">
              {errors.username.message}
            </FormErrorMessage>
          )}
        </FormControl>

        <FormControl id="password" isInvalid={!!error} mb={2}>
          <InputGroup>
            <Input
              {...register("password", {
                required: "Password is required",
              })}
              type={show ? "text" : "password"}
              placeholder="Пароль"
              required
              focusBorderColor="#FF5234"
              borderColor="#FF5234"
              borderRadius="15px"
              h="50px"
              fontFamily="X5 Sans"
              _hover={{ borderColor: "#FF391A" }}
              transition="border-color 0.2s ease-in-out"
            />
            <InputRightElement h="100%" mr={2}>
              <Icon
                as={show ? ViewOffIcon : ViewIcon}
                onClick={setShow.toggle}
                color="#FF5234"
                boxSize={6}
                _hover={{ color: "#FF391A", cursor: "pointer" }}
                transition="color 0.2s ease-in-out"
              />
            </InputRightElement>
          </InputGroup>
          {error && <FormErrorMessage fontFamily="X5 Sans">{error}</FormErrorMessage>}
        </FormControl>

        <Link
          as={RouterLink}
          to="/recover-password"
          color="#FF5234"
          fontSize="sm"
          fontFamily="X5 Sans"
          display="block"
          mb={6}
          textAlign="left"
          _hover={{ color: "#FF391A", textDecoration: "underline" }}
          transition="color 0.2s ease-in-out"
        >
          Забыли пароль?
        </Link>

        <Button
          bg="#FF5234"
          color="white"
          _hover={{ bg: "#FF391A" }}
          type="submit"
          isLoading={isSubmitting}
          w="100%"
          h="50px"
          borderRadius="15px"
          fontFamily="X5 Sans"
          fontWeight="bold"
          fontSize="lg"
          mb={4}
        >
          Войти
        </Button>

        <Text
          fontFamily="X5 Sans"
          color="gray.600"
          textAlign="center"
          _hover={{ color: "#FF5234" }}
          transition="color 0.2s ease-in-out"
        >
          Нет аккаунта?{" "}
          <Link
            as={RouterLink}
            to="/signup"
            color="#FF5234"
            fontWeight="bold"
            _hover={{ color: "#FF391A", textDecoration: "underline" }}
            transition="color 0.2s ease-in-out"
          >
            Зарегистрируйтесь
          </Link>
        </Text>
      </Container>
    </Box>
  )
}

export default Login
