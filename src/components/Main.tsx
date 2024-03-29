import React, { useEffect, useRef, useState } from "react";
import { Sidebar } from "./Sidebar";
import { Rectangle } from "./Rectangle";
import { toast } from "./ui/use-toast";
import { Toaster } from "./ui/toaster";
import { InputFile } from "./InputFile";
import axios from "axios";
import { IFile } from "../models";
import { Copy, Loader2 } from "lucide-react";
import { Button } from "./ui/button";
import { useNavigate } from "react-router-dom";
import { UserImages } from "./oldImagData";

let index = 0;
const colors = [
  "red",
  "blue",
  "green",
  "orange",
  "yellow",
  "purple",
  "pink",
  "teal",
  "brown",
  "gray",
  "black",
  "white",
  "cyan",
  "magenta",
  "lime",
  "indigo",
  "silver",
  "gold",
  "olive",
  "navy",
];

// const randomColor = colors[Math.floor(Math.random() * colors.length)]; // Choix d'une couleur au hasard
const randomColor = () => {
  return colors[Math.floor(Math.random() * colors.length)];
};

export interface IRect {
  id: number;
  name: string;
  left: number;
  top: number;
  width: number;
  height: number;
  color: string;
}
interface IInput {
  inputs: IInputComponent[];
}

interface IInputComponent {
  name: string;
  rectangle: Rectangle;
}

interface Rectangle {
  left: number;
  top: number;
  width: number;
  height: number;
}

export const Main = () => {
  const [rectangles, setRectangles] = useState<IRect[]>([]);
  const [imgLoaded, setImgLoaded] = useState(false);
  const [img, setImg] = useState<IFile | null>(null);
  const imageRef = useRef<HTMLDivElement>(null);
  const [imageId, setImageId] = useState<string>("");

  const [imageLoading, setImageLoading] = useState(false);
  const [recognitionLoading, setRecognitionLoading] = useState(false);
  const [fulltextLoading, setFulltextLoading] = useState(false);

  const [textToCopy, setTextToCopy] = useState("");

  const navigate = useNavigate(); 

  const handleLogout = () => {
    localStorage.removeItem('auth-token'); 
    navigate('/'); 
  };

  const checkName = (name: string): string => {
    let newName = name;
    let counter = 2;

    // Vérifie si le nom existe déjà dans la liste
    let nameExists = rectangles.some((rectangle) => rectangle.name === newName);

    // Si le nom existe déjà, incrémente le nom avec un nombre
    while (nameExists) {
      // Vérifie si le nom se termine déjà par un nombre
      const endsWithNumber = /\d+$/.test(newName);

      if (endsWithNumber) {
        // Si le nom se termine par un nombre, incrémente le nombre
        newName = newName.replace(/\d+$/, counter.toString());
      } else {
        // Si le nom ne se termine pas par un nombre, ajoute "2"
        newName = newName + "2";
      }

      // Vérifie à nouveau si le nom existe déjà
      nameExists = rectangles.some((rectangle) => rectangle.name === newName);

      counter++;
    }

    return newName;
  };

  const handleCopy = () => {
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        console.log("Texte copié avec succès");
      })
      .catch((err) => {
        console.error("Erreur lors de la copie du texte: ", err);
      });
  };

  const uploadImage = async (image: File) => {
    const formData = new FormData();
    formData.append("userId", localStorage.getItem('id') as string);
    formData.append("image", image);
    setImageLoading(true);

    try {
      const auth = localStorage.getItem('auth-token')
      
      const response = await axios.post(
        `${process.env.REACT_APP_GATEWAY_URI}/upload`,
        formData,
        {
          headers:{
            "Authorization":`Bearer ${auth}`
          }
        }
      );
      setImageId(response.data);
    } catch (error:any) {
      if(error.response.status === 401)navigate("/")
    }
    setImageLoading(false);
  };

  useEffect(() => {
    const fetchImage = async () => {
      try {
        const auth = localStorage.getItem('auth-token')
        const response = await axios.get(
          `${process.env.REACT_APP_GATEWAY_URI}/download?id=${imageId}`,
          {
            headers:{
              "Authorization":`Bearer ${auth}`
            }
          }
        );
        setImg(response.data);
        setImgLoaded(true);
      } catch (error:any) {
        if(error.response.status === 401)navigate("/")
      }
    };
    if (imageId != "") {
      fetchImage();
    }
  }, [imageId]);

  const recognize = async () => {
    const input: IInput = {
      inputs: [],
    };
    rectangles.forEach((rectangle) => {
      const inputComponent: IInputComponent = {
        name: rectangle.name,
        rectangle: {
          left: rectangle.left,
          top: rectangle.top,
          width: rectangle.width,
          height: rectangle.height,
        },
      };
      input.inputs.push(inputComponent);
    });
    setRecognitionLoading(true);
    try {
      const auth = localStorage.getItem('auth-token')
      const response = await axios.post(
        `${process.env.REACT_APP_GATEWAY_URI}/ocr?id=${imageId}`,
        input,
        {
          headers:{
            "Authorization":`Bearer ${auth}`
          }
        }
      );
      setTextToCopy(JSON.stringify(response.data, null, 2));
      toast({
        title: "You obtained the following values:",
        description: (
          <div className="flex">
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(response.data, null, 2)}
              </code>
            </pre>
            <Button
              style={{ transform: "translate(-100%,25%)" }}
              type="submit"
              size="sm"
              className="px-3 bg-slate-950"
              onClick={handleCopy}
            >
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ),
      });
    } catch (error:any) {
      if(error.response.status === 401)navigate("/")
    }
    setRecognitionLoading(false);
  };

  const fulltext = async () => {
    setFulltextLoading(true);
    try {
      const auth = localStorage.getItem('auth-token')
      const response = await axios.get(
        `${process.env.REACT_APP_GATEWAY_URI}/ocr?id=${imageId}`,
        {
          headers:{
            "Authorization":`Bearer ${auth}`
          }
        }
      );
      setTextToCopy(JSON.stringify(response.data, null, 2));
      toast({
        title: "You obtained the following values:",
        description: (
          <div className="flex">
            <pre className="mt-2 w-[340px] rounded-md bg-slate-950 p-4">
              <code className="text-white">
                {JSON.stringify(response.data, null, 2)}
              </code>
            </pre>
            <Button
              style={{ transform: "translate(-100%,25%)" }}
              type="submit"
              size="sm"
              className="px-3 bg-slate-950"
              onClick={handleCopy}
            >
              <span className="sr-only">Copy</span>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
        ),
      });
    } catch (error:any) {
      if(error.response.status === 401)navigate("/")
    }
    setFulltextLoading(false);
  };

  const handleDestruct = () => {
    setImg(null);
    setImgLoaded(false);
    setRectangles([]);
  };

  const handleAdd = () => {
    const rectangle: IRect = {
      id: index++,
      name: checkName("New Recognition"),
      left: 0,
      top: 0,
      width: 100,
      height: 100,
      color: randomColor(),
    };
    const newList = [...rectangles];
    newList.push(rectangle);
    setRectangles(newList);
  };
  const updateRect = (rectangle: IRect) => {
    setRectangles((currentRectangles) => {
      // Trouver l'index du rectangle à mettre à jour dans le tableau actuel
      const index = currentRectangles.findIndex((r) => r.id === rectangle.id);

      // Si le rectangle existe (index !== -1), procéder à la mise à jour
      if (index !== -1) {
        // Créer une nouvelle copie du tableau en remplaçant l'élément à l'index trouvé
        const newRectangles = [...currentRectangles];
        newRectangles[index] = rectangle; // Met à jour l'élément avec les nouvelles données

        return newRectangles; // Retourne le nouveau tableau mis à jour
      }

      // Si l'élément n'est pas trouvé, retourne le tableau actuel sans modification
      return currentRectangles;
    });
  };

  return (
    <div className="flex min-h-screen bg-gray-100/40 dark:bg-gray-800/40">
      <div className="flex-1 flex flex-col min-h-screen">
        <header className="flex h-14 items-center gap-4 border-b bg-gray-100/40 px-6 dark:bg-gray-800/40">
          <a className="lg:hidden" href="#">
            <span className="sr-only">Home</span>
          </a>
          <h1 className="font-semibold text-lg md:text-2xl">Recognition</h1>
          <Button onClick={handleLogout} variant="outline" style={{marginLeft: "auto"}}>
            Se déconnecter
          </Button> 
        </header>
        <main className="flex-1 flex flex-col gap-4 p-4 md:gap-8 md:p-6">
          <div className="flex flex-row justify-between">
            <Sidebar
              active={imgLoaded}
              handleFulltext={fulltext}
              colors={colors}
              checkName={checkName}
              handleDestruct={handleDestruct}
              handleRecognize={recognize}
              imgLoaded={imgLoaded}
              rectangles={rectangles}
              handleAdd={handleAdd}
              updateRect={updateRect}
              recognitionLoading={recognitionLoading}
              fulltextLoading={fulltextLoading}
            />
            <div className="flex flex-col gap-10 items-center justify-start">
              <h1 className="font-semibold text-lg md:text-2xl text-center">
                {imgLoaded && img ? img.Name : "Product Name"}
              </h1>
              <div
                ref={imageRef}
                style={{
                  position: "relative",
                }}
              >
                {imgLoaded ? (
                  <img
                    className="rounded-lg"
                    src={`${process.env.REACT_APP_SAVE_IMG_URI}/images/${img?.Path}`}
                    width={1000}
                    style={{
                      objectFit: "cover",
                    }}
                  />
                ) : !imageLoading ? (
                  <InputFile uploadImage={uploadImage} />
                ) : (
                  <Button disabled>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Please wait
                  </Button>
                )}

                {rectangles.map((r) => (
                  <Rectangle
                    image={imageRef.current}
                    key={r.id}
                    rectangle={r}
                    update={updateRect}
                  />
                ))}
              </div>
            </div>
                <UserImages/>
          </div>
        </main>
      </div>
      <Toaster />
    </div>
  );
};
