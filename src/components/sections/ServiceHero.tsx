import Image from 'next/image'

interface ServiceHeroProps {
  title: string
  description: string
  backgroundImage?: string
}

export default function ServiceHero({ title, description, backgroundImage }: ServiceHeroProps) {
  return (
    <section className="relative pt-24 pb-16 bg-service-gradient text-white overflow-hidden">
      {/* Background Image */}
      {backgroundImage && (
        <div className="absolute inset-0 opacity-20">
          <Image
            src={backgroundImage}
            alt=""
            fill
            className="object-cover"
          />
        </div>
      )}

      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0 bg-[url('/images/why-choose-bg.svg')] bg-cover bg-center" />
      </div>

      <div className="container-custom relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="font-poppins font-bold text-4xl lg:text-5xl mb-6">
            {title}
          </h1>
          <p className="text-xl lg:text-2xl text-white/90 leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </section>
  )
}