import React from 'react';
import {
    Box,
    Stack,
    CheckboxGroup,
    Checkbox,
    RadioGroup,
    Radio
} from '@chakra-ui/react';

export default function MultipleChoiceResponse(props) {
    if (props.multipleChoice) {
        return (
            <Box as="section" mt={10}>
                <CheckboxGroup onChange={props.update} value={props.choices}>
                    <Stack spacing={3}>
                        {props.options.map((option, i) => (
                            <Checkbox key={i} value={`${option.text}`} spacing="1rem" size="lg">{option.text}</Checkbox>
                        ))}
                    </Stack>
                </CheckboxGroup>
            </Box>
        );
    } else {
        return (
            <Box as="section" mt={10}>
                <RadioGroup onChange={e => props.update([e])} value={props.choices[0]}>
                    <Stack spacing={3}>
                        {props.options.map((option, i) => (
                            <Radio key={i} value={`${option.text}`} spacing="1rem" size="lg">{option.text}</Radio>
                        ))}
                    </Stack>
                </RadioGroup>
            </Box>
        );
    }
}
