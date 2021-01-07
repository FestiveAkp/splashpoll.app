import React, { useState } from 'react';
import { useHistory } from 'react-router-dom';
import { useMutation } from 'react-query';
import { motion, useCycle } from 'framer-motion';
import { FaQuestionCircle } from 'react-icons/fa';
import {
    Box,
    Stack,
    Flex,
    Input,
    Checkbox,
    Button,
    Switch,
    Text,
    Tooltip,
    Spinner
} from '@chakra-ui/react';
import { queryCache, createPoll } from '../api';

const HelpTooltip = () => (
    <Tooltip
        hasArrow
        bg="gray.300"
        color="black"
        placement="right"
        offset={[0,16]}
        pl={3}
        py={2}
        label="Users enter their own answers to the question and matching responses get counted together."
    >
        <Box ml={2}><FaQuestionCircle /></Box>
    </Tooltip>
);

export default function PollCreate(props) {
    // Router state
    const history = useHistory();
    const [isSubmitting, setIsSubmitting] = useState(false);

    // Form fields
    const [question, setQuestion] = useState('');
    const [answers, setAnswers] = useState(['', '', '']);
    const [openEnded, setOpenEnded] = useState(false);
    const [multipleChoices, setMultipleChoices] = useState(false);
    const [mutate] = useMutation(createPoll);

    // Submit newly created poll to API
    const submit = async () => {
        setIsSubmitting(true);
        const newPoll = {
            question,
            answers: !openEnded ? answers.filter(answer => answer !== '') : [],     // Filter out empty answers
            openEnded,
            multipleChoices
        };

        try {
            const data = await mutate(newPoll);
            queryCache.setQueryData(['poll', data.id], data);
            history.push('/' + data.id);
        } catch (e) {
            console.log(e);
        }
    }

    // Append a new answer field
    const addAnswerField = () => setAnswers(arr => [...arr, '']);

    // Modify an existing answer field
    const updateAnswerField = (i, newValue) => {
        const updatedAnswers = [...answers];
        updatedAnswers[i] = newValue;
        setAnswers(updatedAnswers);

        // Add new field if typing into the last one
        if (i === answers.length - 1) {
            addAnswerField();
        }
    }

    // Animation state
    const [isOpen, toggleOpen] = useCycle(true, false);

    const toggleAnimations = () => {
        setOpenEnded(b => !b);
        toggleOpen();
    }

    const variants = {
        open: {
            opacity: 1,
            y: "0%",
            height: 'auto',
            marginTop: '2rem',
            marginBottom: '2.5rem',
            pointerEvents: 'auto'
        },
        closed: {
            opacity: 0,
            y: "0%",
            height: 0,
            marginTop: '1rem',
            marginBottom: '1rem',
            pointerEvents: 'none',
            transition: { type: 'tween' }
        }
    };

    return (
        <Box className="poll-create">
            <Box as="header">
                <Input
                    value={question}
                    onChange={e => setQuestion(e.target.value)}
                    variant="flushed"
                    placeholder="What's your question?"
                />
            </Box>
            <Box as="section" mt={8}>
                <Flex align="center" width="fit-content">
                    <Switch
                        id="open-ended"
                        isChecked={openEnded}
                        onChange={toggleAnimations}
                        mr={3}
                    />
                    <Text fontWeight="semibold" as="label" htmlFor="open-ended">Open response mode</Text>
                    <HelpTooltip />
                </Flex>
                <Flex align="center" mt={5}>
                    <Switch
                        id="multiple-choice"
                        isChecked={!openEnded}
                        onChange={toggleAnimations}
                        mr={3}
                    />
                    <Text fontWeight="semibold" as="label" htmlFor="multiple-choice">Fixed choice mode</Text>
                </Flex>
            </Box>
            <motion.section
                animate={isOpen ? 'open' : 'closed'}
                initial="open"
                variants={variants}
            >
                <Stack as="section" spacing={3}>
                    {answers.map((answer, i) => (
                        <Input
                            key={i}
                            value={answer}
                            onChange={e => updateAnswerField(i, e.target.value)}
                            variant="flushed"
                            placeholder="Enter answer"
                        />
                    ))}
                </Stack>
            </motion.section>
                <Box as="section">
                    <Stack direction="column">
                        <Checkbox
                            value={multipleChoices}
                            onChange={() => setMultipleChoices(b => !b)}
                            size="sm"
                        >
                            Allow multiple poll answers
                        </Checkbox>
                    </Stack>
                </Box>
                <Flex as="footer" align="center" mt={5}>
                    <Button onClick={submit} colorScheme="twitter">Create Poll</Button>
                    {isSubmitting && <Spinner ml={6} />}
                </Flex>
        </Box>
    );
}
