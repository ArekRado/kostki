export const toBeEqual = (a: unknown, b: unknown): boolean => {
  const isEqual = a === b
  if (!isEqual) {
    console.log('๐ด', a, 'is not equal', b)
  }
  return isEqual
}

export const it =
  (name: string, callback: () => boolean | Promise<unknown>) =>
  async (index: number) => {
    console.log(`  ๐งถ #${index} ${name}`)
    const result = await callback()

    if (result) {
      console.log(`๐ข #${index} it success`)
    } else {
      console.log(`๐ด #${index} it failed`)
    }

    return result
  }

type Describe = (
  name: string,
  callbacks: ReturnType<typeof it>[],
) => boolean | Promise<boolean>
export const describe: Describe = async (name, callbacks) => {
  console.log(`๐ท Running: ${name}`)

  const results = await Promise.all(callbacks.map((x, i) => x(i)))
  const someTestFailed = results.some((result) => result === false)

  if (!someTestFailed) {
    console.log(`๐ข describe success`)
  } else {
    console.log(`๐ด describe failed`)
  }

  return !someTestFailed
}

// type x = Omit<>
