"use client";

import * as React from "react";
import {
  Breadcrumbs as MUIBreadcrumbs,
  Link as MUILink,
  Typography,
  Box,
  type BreadcrumbsProps as MUIBreadcrumbsProps,
  type SxProps,
  type Theme,
} from "@mui/material";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import HomeIcon from "@mui/icons-material/Home";

export type BreadcrumbItem = {
  label: string;
  href?: string;
  icon?: React.ReactNode;
  title?: string;
  external?: boolean;
};

export type BreadcrumbsProps = {
  items: BreadcrumbItem[];
  LinkComponent?: React.ElementType;
  muiProps?: Omit<MUIBreadcrumbsProps, "children">;
  separatorIcon?: React.ReactNode;
  homeLabel?: string;
  ariaLabel?: string;
  dense?: boolean;

  sx?: SxProps<Theme>;
  itemSx?: SxProps<Theme>;
  linkSx?: SxProps<Theme>;
  currentSx?: SxProps<Theme>;
  contentSx?: SxProps<Theme>;
  iconSx?: SxProps<Theme>;
  labelSx?: SxProps<Theme>;
};

const sxJoin = (...parts: Array<SxProps<Theme> | undefined>): SxProps<Theme> =>
  parts.filter(Boolean) as SxProps<Theme>;

export default function Breadcrumbs({
                                      items,
                                      LinkComponent = MUILink,
                                      muiProps,
                                      separatorIcon = <ChevronRightIcon fontSize="small" />,
                                      homeLabel = "Home",
                                      ariaLabel = "Breadcrumb",
                                      dense = false,
                                      sx,
                                      itemSx,
                                      linkSx,
                                      currentSx,
                                      contentSx,
                                      iconSx,
                                      labelSx,
                                    }: BreadcrumbsProps) {
  const lastIndex = items.length - 1;

  const defaultRootSx: SxProps<Theme> = {
    mb: 2,
    "& .MuiBreadcrumbs-li": { display: "flex", alignItems: "center" },
    "& .MuiTypography-root, a": { fontSize: 14, lineHeight: 1.2 },
    ...(dense && { "& .MuiBreadcrumbs-ol": { gap: 0.5 } }),
  };

  const defaultItemSx: SxProps<Theme> = {
    display: "inline-flex",
    alignItems: "center",
  };

  const defaultLinkSx: SxProps<Theme> = {
    textDecoration: "none",
    color: "primary.main",
    "&:hover": { textDecoration: "underline" },
  };

  const defaultCurrentSx: SxProps<Theme> = { color: "text.secondary" };

  const defaultContentSx: SxProps<Theme> = {
    display: "inline-flex",
    alignItems: "center",
    gap: 0.5,
  };

  const Content = ({
                     icon,
                     label,
                     title,
                   }: {
    icon?: React.ReactNode;
    label: string;
    title?: string;
  }) => (
    <Box component="span" sx={sxJoin(defaultContentSx, contentSx)} title={title || label}>
      {icon && <Box component="span" sx={iconSx}>{icon}</Box>}
      <Box component="span" sx={labelSx}>{label}</Box>
    </Box>
  );

  const renderCrumb = (item: BreadcrumbItem, index: number) => {
    const isLast = index === lastIndex;
    const isLink = !!item.href && !isLast;
    const isHome = item.href === "/" || item.label.toLowerCase() === homeLabel.toLowerCase();
    const icon = item.icon ?? (isHome ? <HomeIcon color="primary" sx={{ fontSize: 18 }} /> : null);
    const label = isHome ? homeLabel : item.label;
    const key = item.href || item.label;

    if (isLink) {
      return (
        <MUILink
          key={key}
          component={LinkComponent}
          href={item.href}
          sx={sxJoin(defaultLinkSx, linkSx, itemSx)}
          {...(item.external ? { rel: "noopener noreferrer", target: "_blank" } : {})}
        >
          <Content icon={icon} label={label} title={item.title} />
        </MUILink>
      );
    }

    return (
      <Typography
        key={key}
        component="span"
        aria-current={isLast ? "page" : undefined}
        sx={sxJoin(defaultCurrentSx, currentSx, itemSx)}
      >
        <Content icon={icon} label={label} title={item.title} />
      </Typography>
    );
  };

  return (
    <MUIBreadcrumbs
      aria-label={ariaLabel}
      separator={separatorIcon}
      sx={sxJoin(defaultRootSx, sx)}
      {...muiProps}
    >
      {items.map(renderCrumb)}
    </MUIBreadcrumbs>
  );
}
