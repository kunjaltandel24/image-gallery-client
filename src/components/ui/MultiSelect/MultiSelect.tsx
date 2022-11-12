import Select, { StylesConfig } from 'react-select'
import makeAnimated from 'react-select/animated'
import CreateableSelect from 'react-select/creatable'

import Badge from 'components/ui/Badge'

const animatedComponents = makeAnimated()

export interface IOptionProps {
  value: string
  label: string
  color?: string
  isFixed?: boolean
  isDisabled?: boolean
}

interface MultiSelectProps {
  options: IOptionProps[]
  values?: IOptionProps[]
  onChange: Function
  showTags?: boolean
  placeholder?: string
  isCreatable?: boolean
  instanceId?: string
}

const customStyles: StylesConfig<any, true> = {
  option: (styles) => {
    return {
      ...styles,
    }
  },
  control: (styles) => ({
    ...styles,
    paddingTop: '1px',
    paddingBottom: '1px',
    backgroundColor: '#fff',
    borderRadius: '0.5rem',
    border: '1px solid rgb(235, 235, 235, 1)',
    boxShadow: 'none',
    minHeight: 0,
  }),
}

const MultiSelect = (props: MultiSelectProps) => {
  const { options, placeholder, showTags, values = [], onChange, isCreatable, instanceId } = props
  const selectedOptions: string[] = values.map((value) => value.value)

  const onSelect = (value: IOptionProps) => {
    onChange([...values, value])
  }

  let Comp = Select

  if (isCreatable) {
    Comp = CreateableSelect
  }

  return (
    <>
      <Comp
        // className="form-input-explore form-input w-full p-0"
        placeholder={placeholder || 'search and select'}
        closeMenuOnSelect={false}
        components={animatedComponents}
        isMulti
        options={options}
        styles={customStyles}
        value={values}
        onChange={(newValues) => onChange(newValues)}
        instanceId={instanceId}
      />
      {showTags &&
        <div className="mt-3">
          {options
            .filter((op) => !selectedOptions.includes(op.value))
            .map((badge: any, i: number) =>
              <Badge
                onClick={onSelect}
                className="mr-2 cursor-pointer last:mr-0"
                key={`badge1-${i}`}
                title={badge.label}
                data={badge}
              />
            )}
        </div>
      }
    </>
  )
}

export default MultiSelect
