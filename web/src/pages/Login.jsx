import { useState, useEffect } from 'react';
import { useHistory } from 'react-router-dom';
import {
  Box,
  Button,
  FormControl,
  FormErrorMessage,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightElement,
  VStack,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react';
import { MdVisibility, MdVisibilityOff } from 'react-icons/md';
import { createHandleChange } from '../utils/createHandleChange';
import easyFetch from '../utils/easyFetch';
import useAuth from '../hooks/useAuth';

export default function Login() {
  const history = useHistory();
  const { userData, userMutate } = useAuth();
  const [passShow, setPassShow] = useState(false);
  const { isOpen, onOpen, onClose } = useDisclosure(); // Chakra UI modal hooks
  const [isOpened, setIsOpened] = useState(false);

  useEffect(() => {
    if (userData) {
      history.push('/users');
    }
  }, [userData, history]);

  // Open modal when user scrolls down
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > window.innerHeight / 3 && !isOpened) {
        setIsOpened(true);
        onOpen(); // Open modal
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [isOpened, onOpen]);

  const [fields, setFields] = useState({
    username: '',
    password: '',
  });
  const [errors, setErrors] = useState({
    username: null,
    password: null,
  });

  const handleChange = createHandleChange(setFields, setErrors);

  const handleSubmit = async () => {
    const response = await easyFetch('auth/login', fields);
    const { data, error } = response;
    if (error) {
      error.map(({ field, message }) =>
        setErrors({ ...errors, [field]: message })
      );
    } else {
      await userMutate(data, false);
      history.push('/users');
    }
  };

  // Toggle password visibility
  const togglePasswordVisibility = () => setPassShow(!passShow);

  return (
    <Box w='100%' minH='200vh' backgroundImage="url('https://images.unsplash.com/photo-1538137524007-21e48fa42f3f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=ac9fa0975bd2ebad7afd906c5a3a15ab&auto=format&fit=crop&w=1834&q=80')" backgroundSize="cover">
      {/* Scroll Down Element */}
      {!isOpened && (
        <Box position="fixed" top="50%" left="50%" transform="translate(-50%, -50%)" textAlign="center">
          <div className="scroll-down">SCROLL DOWN
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width="50px" fill="#8c7569">
              <path d="M16 3C8.832031 3 3 8.832031 3 16s5.832031 13 13 13 13-5.832031 13-13S23.167969 3 16 3zm0 2c6.085938 0 11 4.914063 11 11 0 6.085938-4.914062 11-11 11-6.085937 0-11-4.914062-11-11C5 9.914063 9.914063 5 16 5zm-1 4v10.28125l-4-4-1.40625 1.4375L16 23.125l6.40625-6.40625L21 15.28125l-4 4V9z" />
            </svg>
          </div>
        </Box>
      )}

      {/* Modal */}
      <Modal isOpen={isOpen} onClose={onClose} isCentered>
        <ModalOverlay />
        <ModalContent maxW="720px" borderRadius="10px" boxShadow="lg">
          <ModalCloseButton onClick={onClose} />
          <ModalBody p={0}>
            <Box display="flex">
              {/* Left Side of Modal */}
              <Box p={8} flex="1.5" bg="#fff" display="flex" flexDirection="column" justifyContent="center">
                <VStack spacing={4} w="100%" maxW="100%">
                  <FormControl isInvalid={errors.username}>
                    <FormLabel htmlFor='username'>Username</FormLabel>
                    <Input
                      id='username'
                      name='username'
                      placeholder='Username'
                      value={fields.username}
                      onChange={handleChange}
                    />
                    <FormErrorMessage>{errors.username}</FormErrorMessage>
                  </FormControl>
                  <FormControl isInvalid={errors.password}>
                    <FormLabel htmlFor='password'>Password</FormLabel>
                    <InputGroup size='md'>
                      <Input
                        id='password'
                        name='password'
                        type={passShow ? 'text' : 'password'}
                        placeholder='Password'
                        value={fields.password}
                        onChange={handleChange}
                      />
                      <InputRightElement width='4.5rem'>
                        <IconButton
                          aria-label={passShow ? 'Hide' : 'Show'}
                          icon={passShow ? <MdVisibility /> : <MdVisibilityOff />}
                          onClick={togglePasswordVisibility}
                          variant='ghost'
                        />
                      </InputRightElement>
                    </InputGroup>
                    <FormErrorMessage>{errors.password}</FormErrorMessage>
                  </FormControl>
                  <Button colorScheme='green' alignSelf='flex-end' onClick={handleSubmit}>
                    Log In
                  </Button>
                </VStack>
                <Box mt={6} textAlign="center">
                  <p>Don't have an account? <Button variant="link" colorScheme="green">Sign up now</Button></p>
                </Box>
              </Box>

              {/* Right Side of Modal */}
              <Box flex="2" bg="gray.200" display={{ base: "none", md: "block" }}>
                <img
                  src="https://images.unsplash.com/photo-1512486130939-2c4f79935e4f?ixlib=rb-0.3.5&ixid=eyJhcHBfaWQiOjEyMDd9&s=dfd2ec5a01006fd8c4d7592a381d3776&auto=format&fit=crop&w=1000&q=80"
                  alt="Welcome"
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                />
              </Box>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  );
}
