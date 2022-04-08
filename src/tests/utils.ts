export const toBeEqual = (a: unknown, b: unknown): boolean => {
  const isEqual = a === b
  if (!isEqual) {
    console.log('🔴', a, 'is not equal', b)
  }
  return isEqual
}

export const it =
  (name: string, callback: () => boolean | Promise<unknown>) =>
  async (index: number) => {
    console.log(`  🧶 #${index} ${name}`)
    const result = await callback()

    if (result) {
      console.log(`🟢 #${index} it success`)
    } else {
      console.log(`🔴 #${index} it failed`)
    }

    return result
  }

type Describe = (
  name: string,
  callbacks: ReturnType<typeof it>[],
) => boolean | Promise<boolean>
export const describe: Describe = async (name, callbacks) => {
  console.log(`🏷 Running: ${name}`)

  const results = await Promise.all(callbacks.map((x, i) => x(i)))
  const someTestFailed = results.some((result) => result === false)

  if (!someTestFailed) {
    console.log(`🟢 describe success`)
  } else {
    console.log(`🔴 describe failed`)
  }

  return !someTestFailed
}

// type x = Omit<>
