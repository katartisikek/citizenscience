import { useEffect, useState } from 'react';
import { useData } from '../context/DataContext';

const PrivateStorageImage = ({ path, alt = '', style, className }) => {
  const { getFileUrl } = useData();
  const [src, setSrc] = useState('');

  useEffect(() => {
    let active = true;
    setSrc('');

    if (!path) return () => { active = false; };

    getFileUrl(path)
      .then((url) => {
        if (active) setSrc(url || '');
      })
      .catch(() => {
        if (active) setSrc('');
      });

    return () => { active = false; };
  }, [getFileUrl, path]);

  if (!src) return null;

  return <img src={src} alt={alt} style={style} className={className} />;
};

export default PrivateStorageImage;
